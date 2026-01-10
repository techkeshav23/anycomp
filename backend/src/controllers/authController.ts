import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthRequest } from '../types';

// Admin credentials from .env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@anycomp.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

// Generate JWT Token
const generateToken = (email: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '2h') as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET as jwt.Secret, options);
};

// @desc    Admin Login
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

    // Check if email matches admin email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check if password hash is configured
    if (!ADMIN_PASSWORD_HASH) {
      res.status(500).json({
        success: false,
        message: 'Admin password not configured',
      });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = generateToken(ADMIN_EMAIL);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: 'admin',
      },
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

// @desc    Get current logged-in admin
// @route   GET /api/auth/me
// @access  Private (Admin only)
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // User info from JWT (set by protect middleware)
    res.status(200).json({
      success: true,
      user: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: 'admin',
      },
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
