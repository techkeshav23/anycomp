import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import User from '../entity/User';
import Specialist from '../entity/Specialist';
import { AuthRequest, IUser, ISpecialist, UserRole, SpecialistSignupRequest } from '../types';

// Get Repositories
const getUserRepository = () => AppDataSource.getRepository(User);
const getSpecialistRepository = () => AppDataSource.getRepository(Specialist);

// Generate JWT Token
const generateToken = (id: string, role: UserRole): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '2h') as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ id, role }, process.env.JWT_SECRET as jwt.Secret, options);
};

// @desc    Register a new specialist (user + specialist profile)
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      title,
      description,
      base_price 
    } = req.body as SpecialistSignupRequest;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email',
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    const userRepository = getUserRepository();
    const specialistRepository = getSpecialistRepository();

    // Check if user already exists
    const userExists = await userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with role 'specialist'
    const user = userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || null,
      role: 'specialist',
    } as Partial<IUser>);

    await userRepository.save(user);
    const savedUser = user as IUser;

    // Create specialist profile with same ID as user (shared primary key) - Only if title provided
    let specialist = null;
    if (title) {
      const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${savedUser.id}`;
      
      specialist = specialistRepository.create({
        id: savedUser.id, // Shared primary key!
        title,
        slug,
        description: description || null,
        base_price: base_price || 0,
      } as Partial<ISpecialist>);

      await specialistRepository.save(specialist);
    }

    // Generate token
    const token = generateToken(savedUser.id, savedUser.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      specialist: specialist ? {
        id: savedUser.id,
        title,
        slug: `${title.toLowerCase().replace(/\s+/g, '-')}-${savedUser.id}`,
      } : null,
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    // Validate email and password are provided
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }

    const userRepository = getUserRepository();
    const specialistRepository = getSpecialistRepository();

    // Find user with password (need to explicitly select it)
    const user = await userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne() as IUser | null;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Get specialist profile if user is a specialist
    let specialist = null;
    if (user.role === 'specialist') {
      specialist = await specialistRepository.findOne({
        where: { id: user.id },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      specialist: specialist ? {
        id: specialist.id,
        company_name: specialist.company_name,
        title: specialist.title,
        slug: specialist.slug,
        verification_status: specialist.verification_status,
        is_verified: specialist.is_verified,
      } : null,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRepository = getUserRepository();
    const specialistRepository = getSpecialistRepository();

    const user = await userRepository.findOne({
      where: { id: req.user!.id },
    }) as IUser | null;

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get specialist profile if user is a specialist
    let specialist = null;
    if (user.role === 'specialist') {
      specialist = await specialistRepository.findOne({
        where: { id: user.id },
        relations: ['media', 'serviceOfferings'],
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      specialist: specialist || null,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};
