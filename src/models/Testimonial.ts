import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
    author?: mongoose.Types.ObjectId;
    authorName?: string;
    content: string;
    rating: number;
    approved: boolean;
    designation: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}

const TestimonialSchema: Schema = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    approved: { type: Boolean, default: false },
    designation: { type: String, default: 'User' },
}, { timestamps: true });

TestimonialSchema.pre('validate', function (next) {
    if (!this.authorUser && !this.authorName) {
        next(new Error('Testimonial must have either an authorUser or an authorName.'));
    } else {
        next();
    }
});

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);