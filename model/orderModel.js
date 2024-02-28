import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    foodId: { type: Schema.Types.ObjectId, ref: 'Food' },
    orderId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: String,
    paymentMode: { type: String, enum: ['cash', 'card', 'UPI'] }
});

export default model('Order', orderSchema);
