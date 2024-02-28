import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: String,
    password: String,
    googleId: String,
    role: { type: String, enum: ['user', 'specialUser'], default: 'user' },
  });

export default model('User', userSchema);
