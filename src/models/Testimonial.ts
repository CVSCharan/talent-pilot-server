import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
    author: mongoose.Types.ObjectId;
    content: string;
    rating: number;
    approved: boolean;
}

const TestimonialSchema: Schema = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    approved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);