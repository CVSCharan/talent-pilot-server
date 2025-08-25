
import Testimonial, { ITestimonial } from '../models/Testimonial';

export const createTestimonial = async (testimonialData: Partial<ITestimonial>): Promise<ITestimonial> => {
    const testimonial = new Testimonial(testimonialData);
    return testimonial.save();
};

export const getAllTestimonials = async (): Promise<ITestimonial[]> => {
    return Testimonial.find().populate('author', 'displayName email');
};

export const getApprovedTestimonials = async (): Promise<ITestimonial[]> => {
    return Testimonial.find({ approved: true }).populate('author', 'displayName email');
};

export const getTestimonialById = async (id: string): Promise<ITestimonial | null> => {
    return Testimonial.findById(id).populate('author', 'displayName email');
};

export const updateTestimonial = async (id: string, updates: Partial<ITestimonial>): Promise<ITestimonial | null> => {
    return Testimonial.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteTestimonial = async (id: string): Promise<ITestimonial | null> => {
    return Testimonial.findByIdAndDelete(id);
};

export const hasTestimonial = async (userId: string): Promise<boolean> => {
    const testimonial = await Testimonial.findOne({ author: userId, approved: true });
    return !!testimonial;
};
