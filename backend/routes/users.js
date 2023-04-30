const express = require("express");
const {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = express.Router();

router.get("/user", getAllUsers);
router.post("/user", createNewUser);
router.patch("/user", updateUser);
router.delete("/user", deleteUser);

module.exports = router;
