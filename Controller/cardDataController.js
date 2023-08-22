const db = require('../Models');
const { createCardData, updateCardData } = require("../Middleware/validate");
const CardsData = db.cardsData;

exports.createCardData = async (req, res) => {
    try {
        const { error } = createCardData(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { cardId, videoLink, overview, iconText } = req.body;
        await CardsData.create({
            videoLink: videoLink,
            iconText: iconText,
            overview: overview,
            cardId: cardId
        });
        res.status(200).json({
            success: true,
            message: "Card Data created successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getCardData = async (req, res) => {
    try {
        const cardsData = await CardsData.findAll({
            where: { cardId: req.params.cardId }
        });
        res.status(200).json({
            success: true,
            message: "Card Data fetched successfully!",
            data: cardsData
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.deleteCardData = async (req, res) => {
    try {
        const cardsData = await CardsData.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!cardsData) {
            return res.sendStatus(401);
        }
        await cards.destroy();
        res.status(200).json({
            success: true,
            message: "Card's data deleted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.updateCardData = async (req, res) => {
    try {
        const { error } = updateCardData(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const cardsData = await CardsData.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!cardsData) {
            return res.sendStatus(401);
        }
        const { videoLink, overview, iconText } = req.body;
        await cardsData.update({
            ...cardsData,
            videoLink: videoLink,
            iconText: iconText,
            overview: overview,

        });
        res.status(200).json({
            success: true,
            message: "Card's data upadted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}