const joi = require('joi');

exports.adminRegistration = (data) => {
    const schema = joi.object().keys({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required().label('Email'),
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
            .max(20)
    });
    return schema.validate(data);
}

exports.adminLogin = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
            .max(20)
    });
    return schema.validate(data);
}

exports.adminChangePassword = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        oldPassword: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
            .max(20),
        newPassword: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
            .max(20),
    });
    return schema.validate(data);
}

exports.userRegistrationOTP = (data) => {
    const schema = joi.object().keys({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required().label('Email'),
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required()
    }).options({ allowUnknown: true });
    return schema.validate(data);
}

exports.userLogin = (data) => {
    const schema = joi.object().keys({
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
    });
    return schema.validate(data);
}

exports.otpVerification = (data) => {
    const schema = joi.object().keys({
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        mobileOTP: joi.string().length(6).required()
    });
    return schema.validate(data);
}

exports.createCard = (data) => {
    const schema = joi.object().keys({
        titleEnglish: joi.string().min(3).max(100).required(),
        titleHindi: joi.string().min(3).max(100).optional(),
        time: joi.string().required(),
        bgColor2: joi.string().required(),
        bgColor1: joi.string().required(),
        iconText: joi.string().min(3).max(1000).required(),
        image_url: joi.string().optional()
    });
    return schema.validate(data);
}

exports.createCardData = (data) => {
    const schema = joi.object().keys({
        videoLink: joi.string().required(),
        overview: joi.string().required(),
        iconText: joi.string().min(3).max(1000).required(),
        cardId: joi.string().required()
    });
    return schema.validate(data);
}

exports.updateCardData = (data) => {
    const schema = joi.object().keys({
        videoLink: joi.string().required(),
        overview: joi.string().required(),
        iconText: joi.string().min(3).max(1000).required(),
        cardId: joi.string().optional(),
        image_url: joi.string().optional()
    });
    return schema.validate(data);
}

exports.createStep = (data) => {
    const schema = joi.object().keys({
        stepsArr: joi.array().required(),
        cardId: joi.string().required()
    });
    return schema.validate(data);
}

exports.updateStep = (data) => {
    const schema = joi.object().keys({
        stepsArr: joi.array().required(),
        cardId: joi.string().optional()
    });
    return schema.validate(data);
}

exports.userRegistrationPassword = (data) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8),
        mobileNumber: joi.string().length(10).required(),
        confirmPassword: joi.string().required()
    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}

exports.userSignInPassword = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}