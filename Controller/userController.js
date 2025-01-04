const db = require("../Models");
const Users = db.user;
const UserOTP = db.userOTP;
const {
  otpVerification,
  userLogin,
  userRegistrationOTP,
  userRegistrationPassword,
  userSignInPassword,
} = require("../Middleware/validate");
const { JWT_SECRET_KEY_USER, JWT_VALIDITY, OTP_DIGITS_LENGTH, OTP_VALIDITY } =
  process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const generateOTP = require("../Util/generateOTP");
const { sendOTP } = require("../Util/sendOTPToMobileNumber");

exports.registerUserOTP = async (req, res) => {
  try {
    // Body Validation
    const { error } = userRegistrationOTP(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    // Check Duplicacy
    const isUser = await Users.findOne({
      where: {
        [Op.or]: [
          { mobileNumber: req.body.mobileNumber },
          { email: req.body.email },
        ],
      },
    });
    if (isUser) {
      return res.status(400).json({
        success: false,
        message: "This credentials already exist!",
      });
    }
    // Save in DataBase
    const user = await Users.create({
      ...req.body,
    });
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
    // Sending OTP to mobile number
    await sendOTP(req.body.mobileNumber, otp);
    // Store OTP
    await UserOTP.create({
      validTill: new Date().getTime() + parseInt(OTP_VALIDITY),
      otp: otp,
      userId: user.id,
    });
    res.status(200).json({
      success: true,
      message: `Register successfully! OTP send to ${req.body.mobileNumber}!`,
      data: {
        mobileNumber: req.body.mobileNumber,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.loginUserOTP = async (req, res) => {
  try {
    // Body Validation
    const { error } = userLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
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
        message: "Sorry! try to login with correct credentials.",
      });
    }
    // Sending OTP to mobile number
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
    // Sending OTP to mobile number
    await sendOTP(req.body.mobileNumber, otp);
    // Store OTP
    await UserOTP.create({
      validTill: new Date().getTime() + parseInt(OTP_VALIDITY),
      otp: otp,
      userId: user.id,
    });
    res.status(200).json({
      success: true,
      message: `OTP send to ${req.body.mobileNumber}!`,
      data: {
        mobileNumber: req.body.mobileNumber,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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
    // Is Mobile Otp exist
    const isOtp = await UserOTP.findOne({
      where: {
        otp: mobileOTP,
      },
    });
    if (!isOtp) {
      return res.status(400).send({
        success: false,
        message: `Invalid OTP!`,
      });
    }
    // Checking is user present or not
    const user = await Users.findOne({
      where: {
        [Op.and]: [{ mobileNumber: mobileNumber }, { id: isOtp.userId }],
      },
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "No Details Found. Register Now!",
      });
    }
    // is email otp expired?
    const isOtpExpired = new Date().getTime() > parseInt(isOtp.validTill);
    await UserOTP.destroy({ where: { userId: isOtp.userId } });
    if (isOtpExpired) {
      return res.status(400).send({
        success: false,
        message: `OTP expired!`,
      });
    }
    const data = {
      id: user.id,
      mobileNumber: user.mobileNumber,
    };
    const authToken = jwt.sign(
      data,
      JWT_SECRET_KEY_USER,
      { expiresIn: JWT_VALIDITY } // five day
    );
    res.status(201).send({
      success: true,
      message: `OTP verify successfully!`,
      data: user,
      authToken: authToken,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.registerUserPassword = async (req, res) => {
  try {
    // Validate body
    const { error } = userRegistrationPassword(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password should be match!",
      });
    }
    // Check Duplicacy
    const isUser = await Users.findOne({
      where: {
        [Op.or]: [
          { mobileNumber: req.body.mobileNumber },
          { email: req.body.email },
        ],
      },
    });
    if (isUser) {
      return res.status(400).json({
        success: false,
        message: "This credentials already exist!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const bcPassword = await bcrypt.hash(req.body.password, salt);
    // Store in database
    const user = await Users.create({
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      password: bcPassword,
    });
    const data = {
      id: user.id,
      mobileNumber: user.mobileNumber,
    };
    const authToken = jwt.sign(
      data,
      JWT_SECRET_KEY_USER,
      { expiresIn: JWT_VALIDITY } // five day
    );
    res.status(201).send({
      success: true,
      message: `User registered successfully!`,
      data: user,
      authToken: authToken,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      err: err.message,
    });
  }
};

exports.signInUserPassword = async (req, res) => {
  try {
    // Validate body
    const { error } = userSignInPassword(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // Check is present
    const isUser = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!isUser) {
      return res.status(400).json({
        success: false,
        message: "Sorry! try to login with correct credentials.",
      });
    }
    const compairPassword = await bcrypt.compare(
      req.body.password,
      isUser.password
    );
    if (!compairPassword) {
      return res.status(400).send({
        success: false,
        message: "Sorry! try to login with correct credentials.",
      });
    }
    const data = {
      id: isUser.id,
      mobileNumber: isUser.mobileNumber,
    };
    const authToken = jwt.sign(
      data,
      JWT_SECRET_KEY_USER,
      { expiresIn: JWT_VALIDITY } // five day
    );
    res.status(201).send({
      success: true,
      message: `User signIn successfully!`,
      data: isUser,
      authToken: authToken,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      err: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { mobileNumber: req.user.mobileNumber },
        ],
      },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your profile is not present! Are you register?.. ",
      });
    }
    const { name, age, city, country, gender, email } = req.body;
    await user.update({
      ...user,
      name: name,
      city: city,
      country: country,
      gender: gender,
      age: age,
      email: email,
    });
    res.status(200).json({
      success: true,
      message: "User updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { mobileNumber: req.user.mobileNumber },
        ],
      },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your profile is not present! Are you register?.. ",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Profile fetched successfully!",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const user = await Users.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      message: "All User fetched successfully!",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
