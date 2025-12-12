const express = require("express");
const router = express.Router();
const User = require("/models/User");

// Save user data
router.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

module.exports = router;
