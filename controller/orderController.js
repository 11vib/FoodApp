import Order from '../model/orderModel.js';

export async function placeOrder(req, res) {
    try{
        const {userId,foodId,paymentMode,orderId,status} = req.body;
        const order = new Order({userId,foodId,paymentMode,orderId,status});
        await order.save();
        res.status(201).json({ message: 'Order placed successfully' });
    }catch(e){
        console.error(e);
    res.status(500).json({ message: 'Internal server error' });
    }
}