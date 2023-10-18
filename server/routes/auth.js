const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get("/google", verifyToken, async (req, res) => {
  // verify token working good but need to read about this again before auto login for google
  // good till now
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    return res.json({ success: true, user });
  } catch (error) {}
});

// @route post api/auth/google
// @desc Check if user is logged in with google before
// @access Public
router.post("/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens\
  // console.log(tokens)
  // {
  //   access_token: 'ya29.a0AfB_byCSv-x7Cnn34jsBiZQSpuy--r8L5P1eS0s709KVjkbb2l32vrtHkY6X-OwA9uWkgg-JQ3wSDRfnNCMXs8siCz3s6Y6cr1tvTrLdXM7E8LUqCb17g9hCvwYjWh7gO4ylasnC_iOClwUYsKgyVKT5wFpL07bCyEYgaCgYKAcESARISFQGOcNnCY8WlntP5BicVCGhP6zc29w0171',
  //   refresh_token: '1//0eYcii5sV1EJiCgYIARAAGA4SNwF-L9IrMTQTgg59gof6ckqDY2ICmxBoi3Fuq3F5KinY2zGlAcR-JznQMHUOBA4r7VbRgecdJbw',
  //   scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
  //   token_type: 'Bearer',
  //   id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkMzM0NDk3NTA2YWNiNzRjZGVlZGFhNjYxODRkMTU1NDdmODM2OTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2OTk4MDkzODY5NzEtbGhpMTZlbDBkZzN0azg2cThkczFoYTMycmVwNjhudmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2OTk4MDkzODY5NzEtbGhpMTZlbDBkZzN0azg2cThkczFoYTMycmVwNjhudmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMwODY1MjgzOTY5MDUwMzQyODIiLCJlbWFpbCI6Imtob2kyNDA3ODFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ2dHNhUzFKYmZvMGY2QkFaZzE5OWhBIiwibmFtZSI6Iktob2kgTWluaCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKVmsxdzR3ZjBiZzhialg5RWZjMWltclJPbHRVMDd1OFhaM2FlX2lFUVE9czk2LWMiLCJnaXZlbl9uYW1lIjoiS2hvaSIsImZhbWlseV9uYW1lIjoiTWluaCIsImxvY2FsZSI6InZpIiwiaWF0IjoxNjk3NjE1MTExLCJleHAiOjE2OTc2MTg3MTF9.LHLHDacvmQYqGrgoAlXpkbeqOJuMa1E02pg8c323uOphOAK3VdUqbX4VY8udKwXVD3pxAngS6TaDwNK1V9OJ0VDb2r1wE6jjHTPgcXbEpoHCHJc9GvZ97ewtnofczhGIrgyTqmg1lScIb4s3zhE6JJ04mB_Fav-JY4hss5996ZJ3OQb7EGUOwyUD1N-s6Dl_04J8ItqMyCIl9OxugqvzG_GKZnHPJSihIiObfElehDWgtOj20XXwqGT3KTGs0Yk-FFchTP5JEpfdEIbFr0lvQKJ_2ByTvsEsQAJ9UnQ1jvoHFvWxN8m20HmawFB8B2wyf1JHDKLkD4XRNOaEThOO4g',
  //   expiry_date: 1697618712604
  // }

  try {
    // Check for existing user
    const { sub: googleSub } = jwt.decode(tokens.id_token);
    const user = await User.findOne({ googleSub });

    if (user) {
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      return res.json({
        success: true,
        message: "User already logged in with google before",
        accessToken,
      });
    }

    const newUser = new User({ googleSub });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

  // const userInfo = await axios
  //   .get("https://www.googleapis.com/oauth2/v3/userinfo", {
  //     headers: { Authorization: `Bearer ${tokens.access_token}` },
  //   })
  //   .then((res) => res.data);

  // console.log(userInfo);

  // res.send(userInfo.name);
});

module.exports = router;

// {
//   sub: '103086528396905034282', // unique key
//   name: 'Khoi Minh',
//   given_name: 'Khoi',
//   family_name: 'Minh',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocJVk1w4wf0bg8bjX9Efc1imrROltU07u8XZ3ae_iEQQ=s96-c',
//   email: 'khoi240781@gmail.com',
//   email_verified: true,
//   locale: 'vi'
// }
