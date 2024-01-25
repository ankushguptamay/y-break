const express = require('express');

const { registerAdmin, loginAdmin, changePassword, update, getAdmin } = require("../Controller/adminController");
const { createCard, getAllCard, getCard, deleteCard, updateCard } = require("../Controller/cardController");
const { createCardData, getCardData, deleteCardData, updateCardData, getCardDataById } = require("../Controller/cardDataController");
const { createStep, getStep, deleteStep, updateStep, getStepById } = require("../Controller/stepController");
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
admin.put("/updateCard/:id", verifyAdminToken, isAdminPresent, uploadImage.single("iconImage"), updateCard);

admin.post("/createCardData", verifyAdminToken, isAdminPresent, createCardData);
admin.get("/cardsData/:cardId", verifyAdminToken, isAdminPresent, getCardData);
admin.get("/getCardData/:id", verifyAdminToken, isAdminPresent, getCardDataById);
admin.delete("/deleteCardData/:id", verifyAdminToken, isAdminPresent, deleteCardData);
admin.put("/updateCardData/:id", verifyAdminToken, isAdminPresent, updateCardData);

admin.post("/createStep", verifyAdminToken, isAdminPresent, createStep);
admin.get("/steps/:cardId", verifyAdminToken, isAdminPresent, getStep);
admin.get("/getStep/:id", verifyAdminToken, isAdminPresent, getStepById);
admin.delete("/deleteStep/:id", verifyAdminToken, isAdminPresent, deleteStep);
admin.put("/updateStep/:id", verifyAdminToken, isAdminPresent, updateStep);

admin.get("/users", verifyAdminToken, isAdminPresent, getAllUser);

module.exports = admin;