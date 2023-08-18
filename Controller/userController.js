const db = require('../Models');
const Users = db.user;
const { userChangePassword, userLogin, userRegistration } = require("../Middleware/validate");
const { JWT_SECRET_KEY_USER, JWT_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const SALT = 10;

exports.registerUser = async (req, res) => {
    try {
        const { error } = userRegistration(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        const isUser = await Users.findOne({
            where: {
                mobileNumber: req.body.mobileNumber,
            },
        });
        if (isUser) {
            return res.status(400).json({
                success: false,
                message: "User already present!"
            });
        }
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await Users.create({
            ...req.body,
            password: hashedPassword,
        });
        const data = {
            id: user.id,
            mobileNumber: req.body.mobileNumber
        }
        const authToken = jwt.sign(
            data,
            JWT_SECRET_KEY_USER,
            { expiresIn: JWT_VALIDITY } // five day
        );
        res.status(200).json({
            success: true,
            message: 'Register successfully!',
            authToken: authToken
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { error } = userLogin(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json(error.details[0].message);
        }
        const user = await Users.findOne({
            where: {
                mobileNumber: req.body.mobileNumber,
            },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password!"
            });
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password!"
            });
        }
        const data = {
            id: user.id,
            mobileNumber: req.body.mobileNumber
        }
        const authToken = jwt.sign(
            data,
            JWT_SECRET_KEY_USER,
            { expiresIn: JWT_VALIDITY } // five day
        );
        res.status(200).json({
            success: true,
            message: 'Login successfully!',
            authToken: authToken
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { error } = userChangePassword(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json(error.details[0].message);
        }
        const user = await Users.findOne({
            where: {
                mobileNumber: req.body.mobileNumber
            },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password!"
            });
        }
        const validPassword = await bcrypt.compare(
            req.body.oldPassword,
            user.password
        );
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password!"
            });
        }
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        await user.update({
            ...user,
            password: hashedPassword,
        });
        const data = {
            id: user.id,
            mobileNumber: req.body.mobileNumber
        }
        const authToken = jwt.sign(
            data,
            JWT_SECRET_KEY_USER,
            { expiresIn: JWT_VALIDITY } // five day
        );
        res.status(200).json({
            success: true,
            message: 'Password changed successfully!',
            authToken: authToken
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                [Op.and]: [
                    { id: req.user.id }, { mobileNumber: req.user.mobileNumber }
                ]
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Your profile is not present! Are you register?.. "
            })
        };
        const { name, age, city, country, gender } = req.body;
        await user.update({
            ...user,
            name: name,
            city: city,
            country: country,
            gender: gender,
            age: age
        });
        res.status(200).json({
            success: true,
            message: "User updated successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                [Op.and]: [
                    { id: req.user.id }, { mobileNumber: req.user.mobileNumber }
                ]
            },
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Your profile is not present! Are you register?.. "
            })
        };
        res.status(200).json({
            success: true,
            message: "User Profile Fetched successfully!",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const user = await Users.findAll();
        res.status(200).json({
            success: true,
            message: "All User Fetched successfully!",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}