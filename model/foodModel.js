import { Schema, model } from 'mongoose';

const foodSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: { type: String, enum: ['veg', 'non-veg', 'dessert'] }
});

export default model('Food', foodSchema);
