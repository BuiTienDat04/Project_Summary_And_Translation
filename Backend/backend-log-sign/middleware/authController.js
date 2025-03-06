const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("📩 Received login request:", req.body);

        // 🔍 Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ Email not found:", email);
            return res.status(401).json({ message: 'Email does not exist' });
        }

        console.log("🔍 User found:", user);

        // 🔑 Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔑 Password match result:", isMatch);

        if (!isMatch) {
            console.log("❌ Incorrect password for email:", email);
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // 🎫 Generate JWT token (including role for authorization)
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("✅ Login successful! Returning token:", token);
        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });

    } catch (error) {
        console.error("💥 Server error during login:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { login };
