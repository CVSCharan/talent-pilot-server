import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import User from '../models/User';

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        const userRecord = await User.findById(user._id);

        if (!userRecord || !userRecord.googleRefreshToken) {
            return res.status(401).json({ message: 'No refresh token available' });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        oauth2Client.setCredentials({
            refresh_token: userRecord.googleRefreshToken
        });

        const { token } = await oauth2Client.getAccessToken();

        if (token) {
            // Optionally, save the new access token to the user record if you need it server-side
            // userRecord.googleAccessToken = token; 
            // await userRecord.save();

            res.json({ accessToken: token });
        } else {
            res.status(401).json({ message: 'Failed to refresh access token' });
        }
    } catch (error) {
        next(error);
    }
};
