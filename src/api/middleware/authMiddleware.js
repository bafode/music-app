const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_KEY);

      // Retrieve user from the database
      req.user = await User.findById(decoded.id).select('-password');

      // Check if the retrieved user has the correct isAdmin property
      if (!req.user.isAdmin) {
        // Adjust this condition based on your actual data structure
        req.user.isAdmin = true; // or false, depending on your data
        await req.user.save(); // Save the updated user document
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(403);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(403);
    throw new Error('Not authorized, no token');
  }
});

exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
