import { Types,Document } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  favorites: string[]; 
  comparePassword(password: string): Promise<boolean>;
}