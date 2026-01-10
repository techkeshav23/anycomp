import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../types';

// Admin credentials from .env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@anycomp.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

// Protect routes - Verify JWT token (required)
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
    });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if token email matches admin email
    if (decoded.email !== ADMIN_EMAIL) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Not an admin.',
      });
      return;
    }

    // Attach admin info to request object
    req.user = {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: 'admin',
    };
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route.',
    });
  }
};

// Optional Auth - Attach user if token exists, but don't require it
// Use for public routes that behave differently for logged-in users
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, continue without user
  if (!token) {
    next();
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if valid admin token
    if (decoded.email === ADMIN_EMAIL) {
      req.user = {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: 'admin',
      };
    }
  } catch {
    // Token invalid, but we don't care - this is optional auth
  }

  next();
};

// Authorize by role - Role-based access control (only admin exists now)
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route.`,
      });
      return;
    }
    next();
  };
};
