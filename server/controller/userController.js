const { HttpStatusCode } = require("../lib");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const CustomError = require("../util/customError");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Function to register a new user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new CustomError(HttpStatusCode.BAD_REQUEST, "User already exists")
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed in the User model pre-save hook
      avatar
    });

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token
    });
  } catch (error) {
    next(error);
  }
};

// Function to login a user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError(HttpStatusCode.UNAUTHORIZED , "Invalid email or password")
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new CustomError(HttpStatusCode.UNAUTHORIZED, "Invalid email or password")
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
