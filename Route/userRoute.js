const express = require('express');

const { registerUserOTP, loginUserOTP, otpVerification, update, getUser, registerUserPassword, signInUserPassword } = require("../Controller/userController");
const { getAllCard, getCard } = require("../Controller/cardController");
const { } = require("../Controller/cardController");
const { } = require("../Controller/cardDataController");
const { } = require("../Controller/stepController");

const user = express.Router();

// Middleware
const { verifyUserToken } = require('../Middleware/verifyJWT');
const { isUserPresent } = require('../Middleware/isPresent');

user.post("/register", registerUserOTP);
user.post("/login", loginUserOTP);
user.post("/registerByPassword", registerUserPassword);
user.post("/loginByPassword", signInUserPassword);
user.post("/otpVerification", otpVerification);
user.get("/user", verifyUserToken, isUserPresent, getUser);
user.put("/update", verifyUserToken, isUserPresent, update);

user.get("/cards", verifyUserToken, isUserPresent, getAllCard);
user.get("/cards/:id", verifyUserToken, isUserPresent, getCard);

module.exports = user;