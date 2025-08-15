import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import * as emailService from './emailService';

export const signup = async (displayName: string, email: string, password?: string): Promise<IUser> => {
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const user = new User({ 
        displayName, 
        email, 
        password, 
        emailVerificationToken 
    });
    await user.save();
    await emailService.sendVerificationEmail(user.email, emailVerificationToken);
    return user;
};

export const generateToken = (user: IUser): string => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};