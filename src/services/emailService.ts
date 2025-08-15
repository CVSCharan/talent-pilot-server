
import nodemailer from 'nodemailer';
import logger from '../config/logger';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'maddison53@ethereal.email',
        pass: 'jn7jnAPss4f63QBp6D'
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationLink = `http://localhost:${process.env.PORT || 5000}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: '"Your App" <noreply@yourapp.com>',
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
        logger.error('Error sending email', error);
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:${process.env.PORT || 5000}/api/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: '"Your App" <noreply@yourapp.com>',
        to: email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${resetLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p><p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
        logger.error('Error sending email', error);
    }
};
