const db = require('../Models');
const { createStep, updateStep } = require("../Middleware/validate");
const Steps = db.step;

exports.createStep = async (req, res) => {
    try {
        const { error } = createStep(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
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
            },
            order: [
                ['createdAt', 'DESC']
            ]
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

exports.deleteStep = async (req, res) => {
    try {
        const step = await Steps.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!step) {
            return res.sendStatus(401);
        }
        await step.destroy();
        res.status(200).json({
            success: true,
            message: "Step deleted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.updateStep = async (req, res) => {
    try {
        const { error } = updateStep(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const step = await Steps.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!step) {
            return res.sendStatus(401);
        }
        const { stepsArr } = req.body;
        await step.update({
            ...step,
            stepsArr: stepsArr

        });
        res.status(200).json({
            success: true,
            message: "Step upadted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}