const express = require('express');

const { registerAdmin, loginAdmin, changePassword, update, getAdmin } = require("../Controller/adminController");
const { createCard, getAllCard, getCard, deleteCard } = require("../Controller/cardController");
const { createCardData, getCardData } = require("../Controller/cardDataController");
const { createStep, getStep } = require("../Controller/stepController");
const { getAllUser } = require("../Controller/userController");

const admin = express.Router();

// Middleware
const uploadImage = require("../Middleware/uploadImage");
const { verifyAdminToken } = require('../Middleware/verifyJWT');
const { isAdminPresent } = require('../Middleware/isPresent');

admin.post("/register", registerAdmin);
admin.post("/login", loginAdmin);
admin.get("/admin", verifyAdminToken, isAdminPresent, getAdmin);
admin.put("/changePassword", changePassword);
admin.put("/update", verifyAdminToken, isAdminPresent, update);

admin.post("/createCard", verifyAdminToken, isAdminPresent, uploadImage.single("iconImage"), createCard);
admin.get("/cards", verifyAdminToken, isAdminPresent, getAllCard);
admin.get("/cards/:id", verifyAdminToken, isAdminPresent, getCard);
admin.delete("/deleteCard/:id", verifyAdminToken, isAdminPresent, deleteCard);

admin.post("/createCardData", verifyAdminToken, isAdminPresent, createCardData);
admin.get("/cardsData/:cardId", verifyAdminToken, isAdminPresent, getCardData);

admin.post("/createStep", verifyAdminToken, isAdminPresent, createStep);
admin.get("/steps/:cardId", verifyAdminToken, isAdminPresent, getStep);

admin.get("/users", verifyAdminToken, isAdminPresent, getAllUser);

module.exports = admin;