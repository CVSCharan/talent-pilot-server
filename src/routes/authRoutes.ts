import { Router, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import passport from "passport";
import User from "../models/User";
import { IUser } from "../models/User";
import * as authService from "../services/authService";
import * as emailService from "../services/emailService";
import * as userController from "../controllers/userController";
import { validateSignup, validateLogin } from "../middlewares/validation";
import dotenv from "dotenv";

const router = Router();
dotenv.config();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *               - email
 *               - password
 *             properties:
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Bad request
 */
router.post(
  "/signup",
  validateSignup,
  async (req: Request, res: Response, next: NextFunction) => {
    const { displayName, email, password } = req.body;
    try {
      const user = await authService.signup(displayName, email, password);
      res.json({ message: "Verification email sent" });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Returns a JWT token
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/login",
  validateLogin,
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: Error, user: IUser, info: any) => {
        if (err || !user) {
          return res.status(400).json({ message: info.message });
        }
        if (!user.isVerified) {
          return res
            .status(401)
            .json({ message: "Please verify your email before logging in." });
        }
        const token = authService.generateToken(user);
        res.json({ token });
      }
    )(req, res, next);
  }
);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid verification token
 */
router.get(
  "/verify-email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({
        emailVerificationToken: req.query.token as string,
      });
      if (!user) {
        return res.status(400).json({ message: "Invalid verification token" });
      }
      user.isVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post(
  "/forgot-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const passwordResetToken = crypto.randomBytes(20).toString("hex");
      user.passwordResetToken = passwordResetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
      await emailService.sendPasswordResetEmail(user.email, passwordResetToken);
      res.json({ message: "Password reset email sent" });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password has been reset
 *       400:
 *         description: Password reset token is invalid or has expired
 */
router.post(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({
        passwordResetToken: req.query.token as string,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Password reset token is invalid or has expired" });
      }
      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      res.json({ message: "Password has been reset" });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/auth/login/google:
 *   get:
 *     summary: Login with Google
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * @swagger
 * /api/auth/register/google:
 *   get:
 *     summary: Register with Google
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
router.get(
  "/register/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "register",
  })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google callback
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to login page or home page
 */
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const message = info.message === 'User not registered' ? 'no-account-found' : 'access-denied';
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/error?message=${message}`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  userController.googleCallback
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  userController.getMe
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", userController.logout);

export default router;
