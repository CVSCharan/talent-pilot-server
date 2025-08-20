
import { Request, Response, NextFunction } from 'express';
import * as testimonialService from '../services/testimonialService';
import { IUser } from '../models/User';

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, authorName, ...testimonialData } = req.body;

        if (req.user) {
            (testimonialData as any).author = (req.user as IUser)._id;
        } else {
            if (!authorName) {
                return res.status(400).json({ message: 'Author name is required for anonymous testimonials.' });
            }
            (testimonialData as any).authorName = authorName;
        }

        const testimonial = await testimonialService.createTestimonial(testimonialData);
        const newAuthor = testimonial.author ? (testimonial.author as any).displayName : testimonial.authorName;
        const transformedTestimonial: any = {
            _id: testimonial._id,
            content: testimonial.content,
            rating: testimonial.rating,
            approved: testimonial.approved,
            designation: testimonial.designation,
            createdAt: testimonial.createdAt,
            updatedAt: testimonial.updatedAt,
            __v: testimonial.__v,
            author: newAuthor,
        };
        // Explicitly delete authorName from the response object
        delete transformedTestimonial.authorName;
        res.status(201).json(transformedTestimonial);
    } catch (error) {
        next(error);
    }
};

export const getAllTestimonials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonials = await testimonialService.getAllTestimonials();
        const transformedTestimonials = testimonials.map(testimonial => {
            const author = testimonial.author ? (testimonial.author as any).displayName : testimonial.authorName;
            const transformedTestimonial: any = {
                _id: testimonial._id,
                content: testimonial.content,
                rating: testimonial.rating,
                approved: testimonial.approved,
                designation: testimonial.designation,
                createdAt: testimonial.createdAt,
                updatedAt: testimonial.updatedAt,
                __v: testimonial.__v,
                author,
            };
            // Explicitly delete authorName from the response object
            delete transformedTestimonial.authorName;
            return transformedTestimonial;
        });
        res.json(transformedTestimonials);
    } catch (error) {
        next(error);
    }
};

export const getApprovedTestimonials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonials = await testimonialService.getApprovedTestimonials();
        const transformedTestimonials = testimonials.map(testimonial => {
            const author = testimonial.author ? (testimonial.author as any).displayName : testimonial.authorName;
            const transformedTestimonial: any = {
                _id: testimonial._id,
                content: testimonial.content,
                rating: testimonial.rating,
                approved: testimonial.approved,
                designation: testimonial.designation,
                createdAt: testimonial.createdAt,
                updatedAt: testimonial.updatedAt,
                __v: testimonial.__v,
                author,
            };
            // Explicitly delete authorName from the response object
            delete transformedTestimonial.authorName;
            return transformedTestimonial;
        });
        res.json(transformedTestimonials);
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
        const author = testimonial.author ? (testimonial.author as any).displayName : testimonial.authorName;
        const transformedTestimonial: any = {
            _id: testimonial._id,
            content: testimonial.content,
            rating: testimonial.rating,
            approved: testimonial.approved,
            designation: testimonial.designation,
            createdAt: testimonial.createdAt,
            updatedAt: testimonial.updatedAt,
            __v: testimonial.__v,
            author,
        };
        // Explicitly delete authorName from the response object
        delete transformedTestimonial.authorName;
        res.json(transformedTestimonial);
    } catch (error) {
        next(error);
    }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, authorName, ...updateData } = req.body;
        const testimonial = await testimonialService.updateTestimonial(req.params.id, updateData);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        const newAuthor = testimonial.author ? (testimonial.author as any).displayName : testimonial.authorName;
        const transformedTestimonial: any = {
            _id: testimonial._id,
            content: testimonial.content,
            rating: testimonial.rating,
            approved: testimonial.approved,
            designation: testimonial.designation,
            createdAt: testimonial.createdAt,
            updatedAt: testimonial.updatedAt,
            __v: testimonial.__v,
            author: newAuthor,
        };
        // Explicitly delete authorName from the response object
        delete transformedTestimonial.authorName;
        res.json(transformedTestimonial);
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
