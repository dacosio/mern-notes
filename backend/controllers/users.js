const User = require("../models/User");
const Note = require("../models/Notes");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

exports.createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  const user = await User.findOne({ username }).lean().exec();
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = User.create({
    username,
    password: hashedPassword,
    roles,
  });

  if (newUser)
    res.status(201).json({ message: `New user ${username} created` });
  else res.status(400).json({ message: "Error creating new user" });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;
  if (!username || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(400).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }

  const updatedUser = await user.save();

  if (updatedUser) {
    res.status(200).json({ message: `User ${updatedUser.username} updated` });
  } else {
    res.status(400).json({ message: "Error updating user" });
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const notes = await Note.find({ user: id }).exec();
  if (notes.length) {
    return res.status(400).json({ message: "Cannot delete user with notes" });
  }

  const deletedUser = await User.deleteOne({ _id: id }).exec();
  if (deletedUser.deletedCount === 1) {
    res.status(200).json({ message: `User ${user.username} deleted` });
  } else {
    res.status(400).json({ message: "Error deleting user" });
  }
});
