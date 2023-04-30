const mongoose = require("mongoose");
const User = require("../models/User");
const users = [
  {
    username: "jsmith",
    password: "test123",
    roles: ["employee"],
  },
  {
    username: "kdoe",
    password: "test123",
    roles: ["manager"],
  },
  {
    username: "pparker",
    password: "test123",
    roles: ["employee", "admin"],
  },
  {
    username: "lbrown",
    password: "test123",
    roles: ["employee"],
  },
  {
    username: "jjones",
    password: "test123",
    roles: ["manager"],
  },
  {
    username: "ewilliams",
    password: "test123",
    roles: ["employee", "admin"],
  },
  {
    username: "sadams",
    password: "test123",
    roles: ["manager"],
  },
  {
    username: "sarahj",
    password: "test123",
    roles: ["employee"],
  },
  {
    username: "jgraham",
    password: "test123",
    roles: ["manager", "admin"],
  },
  {
    username: "mjohnson",
    password: "test123",
    roles: ["employee"],
  },
];

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDatabase;
