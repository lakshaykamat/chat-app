const express = require("express");
const { registerUser, loginUser } = require("../controller/userController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.post("/register",registerUser);


router.post("/login", loginUser);

// Protected routes (example)
router.get("/profile", isAuthenticated, (req, res) => {
    res.json(req.user);
});

module.exports=router