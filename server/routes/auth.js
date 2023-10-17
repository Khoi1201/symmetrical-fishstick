const express = require("express");
const router = express.Router();
// const argon2 = require("argon2");
// const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.post("/google", verifyToken, async (req, res) => {
  console.log(req.body);
  //   try {
  //     const user = await User.findById(req.userId).select("-password");
  //     if (!user)
  //       return res
  //         .status(400)
  //         .json({ success: false, message: "User not found" });
  //     return res.json({ success: true, user });
  //   } catch (error) {}
});

module.exports = router;
