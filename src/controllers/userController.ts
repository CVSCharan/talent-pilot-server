import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { IUser } from '../models/User';
import * as jwt from 'jsonwebtoken';
import logger from '../config/logger';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as IUser;
        const token = req.headers.authorization?.split(' ')[1];
        res.json({ user, token });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ message: 'Successfully logged out' });
    } catch (error) {
        next(error);
    }
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("Processing Google OAuth callback", {
        callbackUrl: req.originalUrl,
        headers: req.headers.host,
      });
      const user = req.user as IUser;

      if (!user) {
        // This case should ideally be handled by the Passport middleware,
        // but as a fallback, we redirect to a generic failure page.
        logger.warn("Google OAuth callback without user information.");
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/error?message=authentication-failed`);
      }

      // Generate JWT token for API access
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      logger.info(`Google authentication successful for user: ${user.email}`);

      // Ensure token is properly encoded for URL
      const encodedToken = encodeURIComponent(token);
      // Redirect with token as query parameter
      const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/success?token=${encodedToken}`;
      logger.debug(`Redirecting to: ${redirectUrl}`);

      res.redirect(redirectUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      logger.error("Google OAuth callback error:", {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Redirect with a generic error message
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/error?message=authentication-failed`);
    }
  };
