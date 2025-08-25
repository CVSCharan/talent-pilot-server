import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  googleId?: string;
  displayName: string;
  email: string;
  password?: string;
  isVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  photoUrl?: string;
  googleRefreshToken?: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  photoUrl: { type: String },
  isVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  googleRefreshToken: { type: String },
});

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
