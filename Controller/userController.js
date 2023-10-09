const db = require('../Models');
const Users = db.user;
const { otpVerification, userLogin, userRegistration } = require("../Middleware/validate");
const { JWT_SECRET_KEY_USER, JWT_VALIDITY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
});

exports.registerUser = async (req, res) => {
    try {
        // Body Validation
        const { error } = userRegistration(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        // Check Duplicacy
        const isUser = await Users.findOne({
            where: {
                mobileNumber: req.body.mobileNumber
            },
        });
        if (isUser) {
            return res.status(400).json({
                success: false,
                message: "User already present!"
            });
        }
        // Save in DataBase
        await Users.create({
            ...req.body
        });
        // Sending OTP to mobile number
        const countryCode = "+91";
        await twilio.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verifications
            .create({
                to: `${countryCode}${req.body.mobileNumber}`,
                channel: 'sms'
            });
        res.status(200).json({
            success: true,
            message: `Register successfully! OTP send to ${req.body.mobileNumber}!`,
            data: {
                mobileNumber: req.body.mobileNumber
            }
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
        // Body Validation
        const { error } = userLogin(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        // find user in database
        const user = await Users.findOne({
            where: {
                mobileNumber: req.body.mobileNumber,
            },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number! Or No User Present with this credential!"
            });
        }
        // Sending OTP to mobile number
        const countryCode = "+91";
        await twilio.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verifications
            .create({
                to: `${countryCode}${req.body.mobileNumber}`,
                channel: 'sms'
            });
        res.status(200).json({
            success: true,
            message: `OTP send to ${req.body.mobileNumber}!`,
            data: {
                mobileNumber: req.body.mobileNumber
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.otpVerification = async (req, res) => {
    try {
        // Validate body
        const { error } = otpVerification(req.body);
        if (error) {
            // console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        const { mobileNumber, mobileOTP } = req.body;
        const countryCode = "+91";
        // Checking user present or not
        const user = await Users.findOne({
            where: {
                mobileNumber: mobileNumber
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User is not found! First register your self!"
            });
        }
        // verify OTP
        const respond = await twilio.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks
            .create({
                to: `${countryCode}${mobileNumber}`,
                code: mobileOTP
            });
        if (respond.valid === true) {
            // generating auth Token
            const data = {
                id: user.id,
                mobileNumber: mobileNumber
            }
            const authToken = jwt.sign(
                data,
                JWT_SECRET_KEY_USER,
                { expiresIn: JWT_VALIDITY } // five day
            );
            res.status(200).send({
                success: true,
                message: `OTP verified successfully!`,
                authToken: authToken
            });
        } else {
            res.status(400).send({
                success: false,
                message: 'Wrong OTP!'
            })
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

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
        const { name, age, city, country, gender, email } = req.body;
        await user.update({
            ...user,
            name: name,
            city: city,
            country: country,
            gender: gender,
            age: age,
            email: email
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
            message: "User Profile fetched successfully!",
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
        const user = await Users.findAll({
            attributes: { exclude: ['password'] },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(200).json({
            success: true,
            message: "All User fetched successfully!",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}