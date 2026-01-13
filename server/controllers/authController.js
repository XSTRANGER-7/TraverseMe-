const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Mongoose user model

const googleAuth = async (req, res) => {
  try {
    const { token, user } = req.body;

    // Decode token and verify with Google if needed
    // Find or create the user in the database
    let existingUser = await User.findOne({ googleId: user.sub });

    if (!existingUser) {
      const newUser = new User({
        googleId: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
      });

      existingUser = await newUser.save();
    }

    // Generate JWT token (optional, but useful for backend validation)
    const jwtToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token: jwtToken, user: existingUser });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = { googleAuth };
