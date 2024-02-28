// import User from '../model/userModel.js';

// export async function register(req, res) {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
        
//         const { name, email, role } = req.body;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: "User with this email already exists" });
//         }
//         const newUser = new User({
//             name,
//             email,
//             role
//         });
//         await newUser.save();
//         res.json({ user: newUser, message: "Registration successful" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Registration failed" });
//     }
// }

// export async function login(req, res) {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
        
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ error: "Authentication failed" });
//         }
//         if (password !== user.password) {
//             return res.status(401).json({ error: "Authentication failed" });
//         }
//         res.json({ message: 'Login successful' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Authentication failed" });
//     }
// }
