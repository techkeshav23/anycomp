import { Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Specialist, ServiceOffering, ServiceOfferingsMasterList, PlatformFee, Media } from '../entity';
import { AuthRequest, ISpecialist, IPlatformFee, VerificationStatus, PriceCalculation, IServiceOffering, IServiceOfferingsMasterList } from '../types';

// Get repositories
const getSpecialistRepository = () => AppDataSource.getRepository(Specialist);
const getServiceOfferingRepository = () => AppDataSource.getRepository(ServiceOffering);
const getMasterListRepository = () => AppDataSource.getRepository(ServiceOfferingsMasterList);
const getPlatformFeeRepository = () => AppDataSource.getRepository(PlatformFee);
const getMediaRepository = () => AppDataSource.getRepository(Media);

// Helper function to generate slug from title
const generateSlug = (title: string, id: string): string => {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-${id}`;
};

// Helper function to calculate final price with platform fee
const calculateFinalPrice = async (basePrice: number): Promise<PriceCalculation> => {
  const platformFeeRepository = getPlatformFeeRepository();
  
  // Cast DB columns to DECIMAL to allow comparison with float basePrice
  // This prevents "invalid input syntax for type integer" if basePrice has decimals
  const feeTier = await platformFeeRepository
    .createQueryBuilder('pf')
    .where('CAST(pf.min_value AS DECIMAL) <= :price', { price: basePrice })
    .andWhere('(CAST(pf.max_value AS DECIMAL) >= :price OR pf.max_value IS NULL)', { price: basePrice })
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

// ==================== PUBLIC ROUTES ====================

// @desc    Get all specialists with pagination (PUBLIC)
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

    const queryBuilder = specialistRepository
      .createQueryBuilder('specialist')
      .leftJoinAndSelect('specialist.serviceOfferings', 'serviceOfferings')
      .leftJoinAndSelect('serviceOfferings.masterService', 'masterService')
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

    // Search by title
    if (search) {
      queryBuilder.andWhere('specialist.title ILIKE :search', { search: `%${search}%` });
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

    const [specialists, total] = await queryBuilder.getManyAndCount();
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
      relations: ['serviceOfferings', 'serviceOfferings.masterService', 'media'],
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
    if (!req.user || req.user.role !== 'admin') {
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

// ==================== ADMIN FUNCTIONS ====================

// @desc    Create a new specialist (Admin only)
// @route   POST /api/specialists
// @access  Private (Admin only)
export const createSpecialist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, base_price, duration_days, serviceOfferingIds } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Title is required',
      });
      return;
    }

    const specialistRepository = getSpecialistRepository();
    const serviceOfferingRepository = getServiceOfferingRepository();

    // Calculate pricing
    const rawPrice = parseFloat(String(base_price));
    const roundedBasePrice = Math.round((rawPrice + Number.EPSILON) * 100) / 100;
    const priceData = await calculateFinalPrice(roundedBasePrice || 0);

    // Create specialist (no user relation needed)
    const specialist = specialistRepository.create({
      title,
      slug: null,
      description: description || null,
      base_price: roundedBasePrice || 0,
      platform_fee: priceData.platform_fee,
      final_price: priceData.final_price,
      duration_days: duration_days || 1,
      is_draft: true,
      verification_status: 'pending',
    } as Partial<ISpecialist>);

    await specialistRepository.save(specialist);

    // Update slug with actual specialist ID
    const savedSpecialist = specialist as ISpecialist;
    savedSpecialist.slug = generateSlug(title, savedSpecialist.id);
    await specialistRepository.save(savedSpecialist);

    // Add service offerings if provided (array of master_list IDs)
    if (serviceOfferingIds && Array.isArray(serviceOfferingIds)) {
      for (const masterListId of serviceOfferingIds) {
        const serviceOffering = serviceOfferingRepository.create({
          specialists: savedSpecialist.id,
          service_offerings_master_list_id: masterListId,
        } as Partial<IServiceOffering>);
        await serviceOfferingRepository.save(serviceOffering);
      }
    }

    // Fetch complete specialist with relations
    const completeSpecialist = await specialistRepository.findOne({
      where: { id: savedSpecialist.id },
      relations: ['serviceOfferings', 'serviceOfferings.masterService', 'media'],
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

// @desc    Update a specialist (Admin only)
// @route   PUT /api/specialists/:id
// @access  Private (Admin only)
export const updateSpecialist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, base_price, duration_days, serviceOfferingIds } = req.body;

    const specialistRepository = getSpecialistRepository();
    const serviceOfferingRepository = getServiceOfferingRepository();

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
    
    // Ensure duration_days is an integer to avoid DB type errors
    if (duration_days !== undefined) {
      specialist.duration_days = parseInt(String(duration_days), 10) || 1;
    }

    // Recalculate price if base_price changed
    if (base_price !== undefined) {
      // Ensure specific rounding to avoid floating point precision issues
      const rawPrice = parseFloat(String(base_price));
      const roundedBasePrice = Math.round((rawPrice + Number.EPSILON) * 100) / 100;
      
      const priceData = await calculateFinalPrice(roundedBasePrice || 0);
      specialist.base_price = roundedBasePrice || 0;
      specialist.platform_fee = priceData.platform_fee;
      specialist.final_price = priceData.final_price;
    }

    await specialistRepository.save(specialist);

    // Update service offerings if provided
    if (serviceOfferingIds && Array.isArray(serviceOfferingIds)) {
      // Remove existing offerings
      if (specialist.serviceOfferings && specialist.serviceOfferings.length > 0) {
        await serviceOfferingRepository.remove(specialist.serviceOfferings as any);
      }

      // Add new offerings
      for (const masterListId of serviceOfferingIds) {
        const serviceOffering = serviceOfferingRepository.create({
          specialists: id,
          service_offerings_master_list_id: masterListId,
        } as Partial<IServiceOffering>);
        await serviceOfferingRepository.save(serviceOffering);
      }
    }

    // Fetch updated specialist with relations
    const updatedSpecialist = await specialistRepository.findOne({
      where: { id },
      relations: ['serviceOfferings', 'serviceOfferings.masterService', 'media'],
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

// @desc    Publish a specialist (Admin only)
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

    specialist.is_draft = false;
    specialist.verification_status = 'approved';
    specialist.is_verified = true;
    await specialistRepository.save(specialist);

    res.status(200).json({
      success: true,
      message: 'Specialist published successfully',
      data: specialist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unpublish a specialist (Admin only)
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

// @desc    Delete a specialist (soft delete - Admin only)
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

    await specialistRepository.softRemove(specialist);

    res.status(200).json({
      success: true,
      message: 'Specialist deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/Reject a specialist (Admin only)
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

    specialist.verification_status = verification_status;
    specialist.is_verified = verification_status === 'approved';
    
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

// ==================== MASTER LIST CRUD (Admin only) ====================

// @desc    Get all master services
// @route   GET /api/specialists/master-services
// @access  Public
export const getMasterServices = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const masterListRepository = getMasterListRepository();
    const services = await masterListRepository.find({
      order: { title: 'ASC' },
    });

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a master service (Admin only)
// @route   POST /api/specialists/master-services
// @access  Private (Admin only)
export const createMasterService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, s3_key, bucket_name } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Title is required',
      });
      return;
    }

    const masterListRepository = getMasterListRepository();

    const service = masterListRepository.create({
      title,
      description: description || null,
      s3_key: s3_key || null,
      bucket_name: bucket_name || null,
    } as Partial<IServiceOfferingsMasterList>);

    await masterListRepository.save(service);

    res.status(201).json({
      success: true,
      message: 'Master service created successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a master service (Admin only)
// @route   PUT /api/specialists/master-services/:id
// @access  Private (Admin only)
export const updateMasterService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, s3_key, bucket_name } = req.body;

    const masterListRepository = getMasterListRepository();

    const service = await masterListRepository.findOne({
      where: { id },
    }) as IServiceOfferingsMasterList | null;

    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Master service not found',
      });
      return;
    }

    if (title) service.title = title;
    if (description !== undefined) service.description = description;
    if (s3_key !== undefined) service.s3_key = s3_key;
    if (bucket_name !== undefined) service.bucket_name = bucket_name;

    await masterListRepository.save(service);

    res.status(200).json({
      success: true,
      message: 'Master service updated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a master service (Admin only)
// @route   DELETE /api/specialists/master-services/:id
// @access  Private (Admin only)
export const deleteMasterService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const masterListRepository = getMasterListRepository();

    const service = await masterListRepository.findOne({
      where: { id },
    });

    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Master service not found',
      });
      return;
    }

    await masterListRepository.remove(service);

    res.status(200).json({
      success: true,
      message: 'Master service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== PLATFORM FEE ====================

// @desc    Get all platform fee tiers
// @route   GET /api/specialists/platform-fees/all
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

// @desc    Create/Update platform fee tier (Admin only)
// @route   POST /api/specialists/platform-fees
// @access  Private (Admin only)
export const savePlatformFee = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, tier_name, min_value, max_value, platform_fee_percentage } = req.body;

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
