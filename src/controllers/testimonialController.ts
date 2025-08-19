
import { Request, Response, NextFunction } from 'express';
import * as testimonialService from '../services/testimonialService';
import { IUser } from '../models/User';

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as IUser)._id;
        const testimonial = await testimonialService.createTestimonial({ ...req.body, author: userId });
        res.status(201).json(testimonial);
    } catch (error) {
        next(error);
    }
};

export const getAllTestimonials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonials = await testimonialService.getAllTestimonials();
        res.json(testimonials);
    } catch (error) {
        next(error);
    }
};

export const getApprovedTestimonials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonials = await testimonialService.getApprovedTestimonials();
        res.json(testimonials);
    } catch (error) {
        next(error);
    }
};

export const getTestimonialById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonial = await testimonialService.getTestimonialById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json(testimonial);
    } catch (error) {
        next(error);
    }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, ...updateData } = req.body;
        const testimonial = await testimonialService.updateTestimonial(req.params.id, updateData);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json(testimonial);
    } catch (error) {
        next(error);
    }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonial = await testimonialService.deleteTestimonial(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json({ message: 'Testimonial deleted' });
    } catch (error) {
        next(error);
    }
};

export const hasTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as IUser)._id as string;
        const hasTestimonial = await testimonialService.hasTestimonial(userId);
        res.json({ hasTestimonial });
    } catch (error) {
        next(error);
    }
};
