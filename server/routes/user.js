const express = require("express");
const { registerUser, loginUser,allUsers,searchUser } = require("../controller/userController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.get("/",isAuthenticated,allUsers);
router.post("/register",registerUser);
router.post("/login", loginUser);

// Protected routes (example)
router.get("/me", isAuthenticated, (req, res) => {
    res.json(req.user);
});

module.exports=router