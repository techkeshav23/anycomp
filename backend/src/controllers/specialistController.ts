import { Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Specialist, ServiceOffering, PlatformFee, Media, User } from '../entity';
import { AuthRequest, ISpecialist, IPlatformFee, IMedia, VerificationStatus, PriceCalculation, IServiceOffering, IUser } from '../types';

// Get repositories
const getSpecialistRepository = () => AppDataSource.getRepository(Specialist);
const getServiceOfferingRepository = () => AppDataSource.getRepository(ServiceOffering);
const getPlatformFeeRepository = () => AppDataSource.getRepository(PlatformFee);
const getMediaRepository = () => AppDataSource.getRepository(Media);
const getUserRepository = () => AppDataSource.getRepository(User);

// Helper function to generate slug from title
const generateSlug = (title: string, id: number): string => {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-${id}`;
};

// Helper function to calculate final price with platform fee
const calculateFinalPrice = async (basePrice: number): Promise<PriceCalculation> => {
  const platformFeeRepository = getPlatformFeeRepository();
  
  // Find the appropriate fee tier based on base_price
  const feeTier = await platformFeeRepository
    .createQueryBuilder('pf')
    .where('pf.min_value <= :price', { price: basePrice })
    .andWhere('(pf.max_value >= :price OR pf.max_value IS NULL)', { price: basePrice })
    .getOne() as IPlatformFee | null;

  if (feeTier) {
    const platformFee = (basePrice * parseFloat(String(feeTier.platform_fee_percentage))) / 100;
    return {
      platform_fee: platformFee,
      final_price: basePrice + platformFee,
    };
  }

  return {
    platform_fee: 0,
    final_price: basePrice,
  };
};

// @desc    Get all specialists with pagination, filtering, and search (PUBLIC - no login required)
// @route   GET /api/specialists
// @access  Public
export const getAllSpecialists = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      is_draft,
      verification_status,
      search,
      page = '1',
      limit = '10',
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query as {
      is_draft?: string;
      verification_status?: VerificationStatus;
      search?: string;
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: string;
    };

    const specialistRepository = getSpecialistRepository();

    // Build query - join with user to get name, email
    const queryBuilder = specialistRepository
      .createQueryBuilder('specialist')
      .leftJoinAndSelect('specialist.user', 'user')
      .leftJoinAndSelect('specialist.serviceOfferings', 'serviceOfferings')
      .leftJoinAndSelect('specialist.media', 'media');

    // For public users, only show published & approved specialists
    if (!req.user || req.user.role !== 'admin') {
      queryBuilder.andWhere('specialist.is_draft = :is_draft', { is_draft: false });
      queryBuilder.andWhere('specialist.verification_status = :status', { status: 'approved' });
    } else {
      // Admin can filter
      if (is_draft !== undefined) {
        queryBuilder.andWhere('specialist.is_draft = :is_draft', { 
          is_draft: is_draft === 'true' 
        });
      }
      if (verification_status) {
        queryBuilder.andWhere('specialist.verification_status = :verification_status', { 
          verification_status 
        });
      }
    }

    // Search by title or company_name (case-insensitive)
    if (search) {
      queryBuilder.andWhere(
        '(specialist.title ILIKE :search OR specialist.company_name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Exclude soft-deleted
    queryBuilder.andWhere('specialist.deleted_at IS NULL');

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    queryBuilder.skip(skip).take(parseInt(limit));

    // Sorting
    const validSortFields = ['created_at', 'updated_at', 'title', 'base_price', 'average_rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`specialist.${sortField}`, order);

    // Execute query
    const [specialists, total] = await queryBuilder.getManyAndCount();

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: specialists,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single specialist by ID (PUBLIC)
// @route   GET /api/specialists/:id
// @access  Public
export const getSpecialistById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const specialistRepository = getSpecialistRepository();

    const specialist = await specialistRepository.findOne({
      where: { id },
      relations: ['user', 'serviceOfferings', 'media'],
    });

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    // Public users can only see published & approved specialists
    const specialistData = specialist as ISpecialist;
    if (!req.user || (req.user.role !== 'admin' && req.user.id !== specialistData.id)) {
      if (specialistData.is_draft || specialistData.verification_status !== 'approved') {
        res.status(404).json({
          success: false,
          message: 'Specialist not found',
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: specialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my specialist profile (logged-in specialist only)
// @route   GET /api/specialists/me
// @access  Private (Specialist)
export const getMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const specialistRepository = getSpecialistRepository();

    const specialist = await specialistRepository.findOne({
      where: { id: req.user!.id }, // Shared PK: specialist.id = user.id
      relations: ['user', 'serviceOfferings', 'media'],
    });

    // Return null if no specialist profile exists yet (user hasn't created their service)
    res.status(200).json({
      success: true,
      data: specialist || null,
    });
  } catch (error) {
    next(error);
  }
};

interface UpdateProfileBody {
  title?: string;
  description?: string;
  base_price?: number;
  duration_days?: number;
  service_category?: string;
  supported_company_types?: string[];
}

// @desc    Create my specialist profile (first time)
// @route   POST /api/specialists/me
// @access  Private (Specialist only)
export const createMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, base_price, duration_days } = req.body as UpdateProfileBody;

    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Title is required',
      });
      return;
    }

    const specialistRepository = getSpecialistRepository();

    // Check if profile already exists
    const existingSpecialist = await specialistRepository.findOne({
      where: { id: req.user!.id },
    });

    if (existingSpecialist) {
      res.status(400).json({
        success: false,
        message: 'Specialist profile already exists. Use PUT /api/specialists/me to update.',
      });
      return;
    }

    // Calculate pricing
    const priceData = await calculateFinalPrice(parseFloat(String(base_price)) || 0);

    // Create specialist profile with same ID as user (shared primary key)
    const slug = generateSlug(title, req.user!.id);

    const specialist = specialistRepository.create({
      id: req.user!.id, // Shared PK!
      title,
      slug,
      description: description || null,
      base_price: parseFloat(String(base_price)) || 0,
      platform_fee: priceData.platform_fee,
      final_price: priceData.final_price,
      duration_days: duration_days || 1,
      is_draft: true,
      verification_status: 'pending',
    } as Partial<ISpecialist>);

    await specialistRepository.save(specialist);

    res.status(201).json({
      success: true,
      message: 'Specialist profile created successfully',
      data: specialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update my specialist profile
// @route   PUT /api/specialists/me
// @access  Private (Specialist only - can only update own profile)
export const updateMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      company_name,
      company_description,
      certifications,
      title,
      description,
      base_price,
      duration_days,
    } = req.body as UpdateProfileBody;

    const specialistRepository = getSpecialistRepository();

    // Find my specialist profile (specialist.id = user.id)
    let specialist = await specialistRepository.findOne({
      where: { id: req.user!.id },
    }) as ISpecialist | null;

    if (!specialist) {
      // If no profile exists, create one instead of returning 404
      if (!title) {
        res.status(400).json({
          success: false,
          message: 'Title is required to create specialist profile',
        });
        return;
      }

      const priceData = await calculateFinalPrice(parseFloat(String(base_price)) || 0);
      const slug = generateSlug(title, req.user!.id);

      specialist = specialistRepository.create({
        id: req.user!.id,
        title,
        slug,
        description: description || null,
        base_price: parseFloat(String(base_price)) || 0,
        platform_fee: priceData.platform_fee,
        final_price: priceData.final_price,
        duration_days: duration_days || 1,
        is_draft: true,
        verification_status: 'pending',
      } as Partial<ISpecialist>);
    } else {
      // Update existing profile
      if (title) {
        specialist.title = title;
        specialist.slug = generateSlug(title, specialist.id);
      }
      if (description !== undefined) specialist.description = description;
      if (duration_days) specialist.duration_days = duration_days;
    }

    // Recalculate price if base_price changed
    if (base_price !== undefined) {
      const priceData = await calculateFinalPrice(parseFloat(String(base_price)) || 0);
      specialist.base_price = parseFloat(String(base_price)) || 0;
      specialist.platform_fee = priceData.platform_fee;
      specialist.final_price = priceData.final_price;
    }

    // When profile is updated, reset to pending verification
    specialist.verification_status = 'pending';
    specialist.is_verified = false;

    await specialistRepository.save(specialist);

    // Fetch updated profile with relations
    const updatedSpecialist = await specialistRepository.findOne({
      where: { id: req.user!.id },
      relations: ['user', 'serviceOfferings', 'media'],
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedSpecialist,
    });
  } catch (error) {
    next(error);
  }
};

interface AddServiceOfferingBody {
  title: string;
  description?: string;
  price?: number;
}

// @desc    Add a service offering to my profile
// @route   POST /api/specialists/me/services
// @access  Private (Specialist only)
export const addServiceOffering = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, price } = req.body as AddServiceOfferingBody;

    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Title is required',
      });
      return;
    }

    const serviceOfferingRepository = getServiceOfferingRepository();

    const offering = serviceOfferingRepository.create({
      specialists: req.user!.id,
      title,
      description: description || null,
      price: parseFloat(String(price)) || 0,
    } as Partial<IServiceOffering>);

    await serviceOfferingRepository.save(offering);

    res.status(201).json({
      success: true,
      message: 'Service offering added successfully',
      data: offering,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service offering from my profile
// @route   DELETE /api/specialists/me/services/:offeringId
// @access  Private (Specialist only)
export const deleteMyServiceOffering = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { offeringId } = req.params;
    const serviceOfferingRepository = getServiceOfferingRepository();

    const offering = await serviceOfferingRepository.findOne({
      where: { id: offeringId, specialists: req.user!.id },
    });

    if (!offering) {
      res.status(404).json({
        success: false,
        message: 'Service offering not found or not owned by you',
      });
      return;
    }

    await serviceOfferingRepository.remove(offering);

    res.status(200).json({
      success: true,
      message: 'Service offering deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit profile for review (set is_draft = false)
// @route   PATCH /api/specialists/me/submit
// @access  Private (Specialist only)
export const submitForReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const specialistRepository = getSpecialistRepository();

    const specialist = await specialistRepository.findOne({
      where: { id: req.user!.id },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist profile not found',
      });
      return;
    }

    // Submit for review
    specialist.is_draft = false;
    specialist.verification_status = 'under_review';
    await specialistRepository.save(specialist);

    res.status(200).json({
      success: true,
      message: 'Profile submitted for review',
      data: specialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit for publish (Specialist requests to publish - goes to admin for approval)
// @route   PATCH /api/specialists/me/publish
// @access  Private (Specialist only)
export const publishMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const specialistRepository = getSpecialistRepository();

    const specialist = await specialistRepository.findOne({
      where: { id: req.user!.id },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist profile not found',
      });
      return;
    }

    if (specialist.is_draft) {
      // Specialist wants to publish - submit for admin review
      specialist.is_draft = false;
      specialist.verification_status = 'under_review';
      await specialistRepository.save(specialist);

      res.status(200).json({
        success: true,
        message: 'Profile submitted for admin approval',
        data: specialist,
      });
    } else {
      // Specialist wants to unpublish - set back to draft
      specialist.is_draft = true;
      specialist.verification_status = 'pending';
      await specialistRepository.save(specialist);

      res.status(200).json({
        success: true,
        message: 'Profile unpublished and set to draft',
        data: specialist,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN FUNCTIONS ====================

// @desc    Create a new specialist (Admin creates specialist with a new user)
// @route   POST /api/specialists
// @access  Private (Admin only)
export const createSpecialist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, base_price, duration_days, name, email, password, serviceOfferings } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Title is required',
      });
      return;
    }

    // Check if we're creating with a new user or just the specialist profile
    const specialistRepository = getSpecialistRepository();
    const userRepository = getUserRepository();
    const serviceOfferingRepository = getServiceOfferingRepository();

    let userId: string;

    // If email is provided, create a new user for this specialist
    if (email) {
      // Check if user with this email already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'A user with this email already exists',
        });
        return;
      }

      // Hash password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password || 'defaultPassword123', 12);

      // Create new user
      const newUser = userRepository.create({
        name: name || title,
        email,
        password: hashedPassword,
        role: 'specialist',
      });
      await userRepository.save(newUser);
      userId = (newUser as IUser).id;
    } else {
      // Generate a placeholder user for this specialist
      const bcrypt = require('bcryptjs');
      const placeholderEmail = `specialist-${Date.now()}@placeholder.local`;
      const hashedPassword = await bcrypt.hash('placeholder123', 12);

      const newUser = userRepository.create({
        name: name || title,
        email: placeholderEmail,
        password: hashedPassword,
        role: 'specialist',
      });
      await userRepository.save(newUser);
      userId = (newUser as IUser).id;
    }

    // Calculate pricing
    const priceData = await calculateFinalPrice(parseFloat(String(base_price)) || 0);

    // Create specialist profile
    const slug = generateSlug(title, userId as unknown as number);

    const specialist = specialistRepository.create({
      id: userId,
      title,
      slug,
      description: description || null,
      base_price: parseFloat(String(base_price)) || 0,
      platform_fee: priceData.platform_fee,
      final_price: priceData.final_price,
      duration_days: duration_days || 1,
      is_draft: true,
      verification_status: 'pending',
    } as Partial<ISpecialist>);

    await specialistRepository.save(specialist);

    // Add service offerings if provided
    if (serviceOfferings && Array.isArray(serviceOfferings)) {
      for (const offering of serviceOfferings) {
        if (offering.name && offering.price > 0) {
          const serviceOffering = serviceOfferingRepository.create({
            name: offering.name,
            price: parseFloat(String(offering.price)),
            specialist: { id: userId },
          } as Partial<IServiceOffering>);
          await serviceOfferingRepository.save(serviceOffering);
        }
      }
    }

    // Fetch the complete specialist with relations
    const completeSpecialist = await specialistRepository.findOne({
      where: { id: userId },
      relations: ['user', 'serviceOfferings', 'media'],
    });

    res.status(201).json({
      success: true,
      message: 'Specialist created successfully',
      data: completeSpecialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specialist (Admin can update any specialist)
// @route   PUT /api/specialists/:id
// @access  Private (Admin only)
export const updateSpecialist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      base_price,
      duration_days,
      service_category,
      supported_company_types,
      serviceOfferings,
    } = req.body;

    const specialistRepository = getSpecialistRepository();
    const serviceOfferingRepository = getServiceOfferingRepository();

    // Find the specialist
    const specialist = await specialistRepository.findOne({
      where: { id },
      relations: ['serviceOfferings'],
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    // Update fields
    if (title) {
      specialist.title = title;
      specialist.slug = generateSlug(title, specialist.id);
    }
    if (description !== undefined) specialist.description = description;
    if (duration_days) specialist.duration_days = duration_days;

    // Recalculate price if base_price changed
    if (base_price !== undefined) {
      const priceData = await calculateFinalPrice(parseFloat(String(base_price)) || 0);
      specialist.base_price = parseFloat(String(base_price)) || 0;
      specialist.platform_fee = priceData.platform_fee;
      specialist.final_price = priceData.final_price;
    }

    await specialistRepository.save(specialist);

    // Update service offerings if provided
    if (serviceOfferings && Array.isArray(serviceOfferings)) {
      // Remove existing offerings
      if (specialist.serviceOfferings && specialist.serviceOfferings.length > 0) {
        await serviceOfferingRepository.remove(specialist.serviceOfferings as any);
      }

      // Add new offerings
      for (const offering of serviceOfferings) {
        const offeringName = offering.name || offering.title;
        if (offeringName) {
          const serviceOffering = serviceOfferingRepository.create({
            name: offeringName,
            price: parseFloat(String(offering.price)) || 0,
            specialist: { id },
          } as Partial<IServiceOffering>);
          await serviceOfferingRepository.save(serviceOffering);
        }
      }
    }

    // Fetch updated specialist with relations
    const updatedSpecialist = await specialistRepository.findOne({
      where: { id },
      relations: ['user', 'serviceOfferings', 'media'],
    });

    res.status(200).json({
      success: true,
      message: 'Specialist updated successfully',
      data: updatedSpecialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish a specialist (Admin approves - set is_draft = false, verification = approved)
// @route   PATCH /api/specialists/:id/publish
// @access  Private (Admin only)
export const publishSpecialist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const specialistRepository = getSpecialistRepository();

    const specialist = await specialistRepository.findOne({
      where: { id },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    // Publish and approve
    specialist.is_draft = false;
    specialist.verification_status = 'approved';
    specialist.is_verified = true;
    await specialistRepository.save(specialist);

    res.status(200).json({
      success: true,
      message: 'Specialist published and approved successfully',
      data: specialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unpublish a specialist (set is_draft = true)
// @route   PATCH /api/specialists/:id/unpublish
// @access  Private (Admin only)
export const unpublishSpecialist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const specialistRepository = getSpecialistRepository();

    const specialist = await specialistRepository.findOne({
      where: { id },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    // Unpublish
    specialist.is_draft = true;
    await specialistRepository.save(specialist);

    res.status(200).json({
      success: true,
      message: 'Specialist unpublished successfully',
      data: specialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a specialist (soft delete)
// @route   DELETE /api/specialists/:id
// @access  Private (Admin only)
export const deleteSpecialist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const specialistRepository = getSpecialistRepository();

    const specialist = await specialistRepository.findOne({
      where: { id },
    });

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    // Soft delete - TypeORM will set deleted_at automatically
    await specialistRepository.softRemove(specialist);

    res.status(200).json({
      success: true,
      message: 'Specialist deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service offering (Admin)
// @route   DELETE /api/specialists/:id/service-offerings/:offeringId
// @access  Private (Admin only)
export const deleteServiceOffering = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { offeringId } = req.params;
    const serviceOfferingRepository = getServiceOfferingRepository();

    const offering = await serviceOfferingRepository.findOne({
      where: { id: offeringId },
    });

    if (!offering) {
      res.status(404).json({
        success: false,
        message: 'Service offering not found',
      });
      return;
    }

    await serviceOfferingRepository.remove(offering);

    res.status(200).json({
      success: true,
      message: 'Service offering deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/Reject a specialist (change verification status)
// @route   PATCH /api/specialists/:id/verify
// @access  Private (Admin only)
export const verifySpecialist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { verification_status } = req.body as { verification_status?: VerificationStatus };

    // Validate verification status
    const validStatuses: VerificationStatus[] = ['pending', 'approved', 'under_review', 'rejected'];
    if (!verification_status || !validStatuses.includes(verification_status)) {
      res.status(400).json({
        success: false,
        message: `Invalid verification status. Must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const specialistRepository = getSpecialistRepository();

    const specialist = await specialistRepository.findOne({
      where: { id },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    // Update verification status
    specialist.verification_status = verification_status;
    specialist.is_verified = verification_status === 'approved';
    
    // If approved, also publish
    if (verification_status === 'approved') {
      specialist.is_draft = false;
    }
    
    await specialistRepository.save(specialist);

    res.status(200).json({
      success: true,
      message: `Specialist verification status changed to '${verification_status}'`,
      data: specialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform fee tiers
// @route   GET /api/platform-fees
// @access  Public
export const getPlatformFees = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const platformFeeRepository = getPlatformFeeRepository();
    const fees = await platformFeeRepository.find({
      order: { min_value: 'ASC' },
    });

    res.status(200).json({
      success: true,
      data: fees,
    });
  } catch (error) {
    next(error);
  }
};

interface SavePlatformFeeBody {
  id?: string;
  tier_name?: string;
  min_value?: number;
  max_value?: number | null;
  platform_fee_percentage?: number;
}

// @desc    Create/Update platform fee tier
// @route   POST /api/platform-fees
// @access  Private (Admin only)
export const savePlatformFee = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, tier_name, min_value, max_value, platform_fee_percentage } = req.body as SavePlatformFeeBody;

    const platformFeeRepository = getPlatformFeeRepository();

    const feeData: Partial<IPlatformFee> = {
      tier_name: tier_name as IPlatformFee['tier_name'],
      min_value: min_value || 0,
      max_value: max_value || null,
      platform_fee_percentage: platform_fee_percentage || 0,
    };

    if (id) {
      feeData.id = id;
    }

    const result = await platformFeeRepository.save(feeData);

    res.status(id ? 200 : 201).json({
      success: true,
      message: id ? 'Platform fee updated' : 'Platform fee created',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
