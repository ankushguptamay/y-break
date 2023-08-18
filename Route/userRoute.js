const express = require('express');

const { registerUser, loginUser, changePassword, update, getUser } = require("../Controller/userController");
const { } = require("../Controller/cardController");
const { } = require("../Controller/cardDataController");
const { } = require("../Controller/stepController");

const user = express.Router();

// Middleware
const { verifyUserToken } = require('../Middleware/verifyJWT');
const { isUserPresent } = require('../Middleware/isPresent');

user.post("/register", registerUser);
user.post("/login", loginUser);
user.get("/user", verifyUserToken, isUserPresent, getUser);
user.put("/changePassword", changePassword);
user.put("/update", verifyUserToken, isUserPresent, update);

module.exports = user;