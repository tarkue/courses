import { Schema, Document } from 'mongoose';
import { Grades } from '../enums';

export interface IUser {
  _id: string;
  email: string;
  hashedPassword: string;
  passwordResetToken: string;
  grade: Grades;
}

export type UserDocument = IUser & Document;

export const UserSchema = new Schema<IUser>(
  {
    email: String,
    hashedPassword: String,
    passwordResetToken: String,
    grade: {
      type: String,
      enum: Grades,
    },
  },
  {
    _id: true,
  },
);

UserSchema.index({ email: 1 }, { unique: true });
