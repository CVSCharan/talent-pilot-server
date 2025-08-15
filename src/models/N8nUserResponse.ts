import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IN8nUserResponse extends Document {
  user: IUser['_id'];
  responseData: object;
  createdAt: Date;
}

const N8nUserResponseSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  responseData: { type: Object, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<IN8nUserResponse>('N8nUserResponse', N8nUserResponseSchema);
