const db = require('../Models');
const { createStep } = require("../Middleware/validate");
const Steps = db.step;

exports.createStep = async (req, res) => {
    try {
        const { error } = createStep(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        const { cardId, stepsArr } = req.body;
        await Steps.create({
            stepsArr: stepsArr,
            cardId: cardId
        });
        res.status(200).json({
            success: true,
            message: "Step stored successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getStep = async (req, res) => {
    try {
        const steps = await Steps.findAll({
            where: {
                cardId: req.params.cardId
            }
        });
        res.status(200).json({
            success: true,
            message: "Step fetched successfully!",
            data: steps
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}