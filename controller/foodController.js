import Food from '../model/foodModel.js';

export async function getAllFoods(req, res) {
    try{
        const food = await Food.find();
        res.json(food);
    }catch(e){
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getFoodById(req, res) {
    try {
        const foodId = parseInt(req.query.id);
        const food = await Food.find({ foodId });
        res.json(food);
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
      }
}
