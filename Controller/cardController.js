const db = require('../Models');
const { createCard } = require("../Middleware/validate");
const { deleteSingleFile } = require("../Util/deleteFile");
const Cards = db.card;
const CardsData = db.cardsData;
const Step = db.step;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.createCard = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Icon Image is required!"
            })
        }
        const { error } = createCard(req.body);
        if (error) {
            deleteSingleFile(req.file.path);
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { titleEnglish, titleHindi, time, bgColor1, bgColor2, iconText, image_url } = req.body;
        const imagePath = `./Resources/${req.file.filename}`;
        const response = await cloudinary.uploader.upload(imagePath);
        // delete file from resource/servere
        deleteSingleFile(req.file.path);

        await Cards.create({
            cloudinaryFileId: response.public_id,
            titleEnglish: titleEnglish,
            time: time,
            titleHindi: titleHindi,
            bgColor1: bgColor1,
            bgColor2: bgColor2,
            iconText: iconText,
            image_url: image_url,
            iconImage_OriginalName: req.file.originalname,
            iconImage_FileName: req.file.filename,
            iconImage_Path: response.secure_url,
            adminId: req.admin.id
        });
        res.status(200).json({
            success: true,
            message: "Card created successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getAllCard = async (req, res) => {
    try {
        const cards = await Cards.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(200).json({
            success: true,
            message: "Cards fetched successfully!",
            data: cards
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getCard = async (req, res) => {
    try {
        const cards = await Cards.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: CardsData,
                as: "cardsDatas",
                order: [
                    ['createdAt', 'DESC']
                ]

            }, {
                model: Step,
                as: "steps",
                order: [
                    ['createdAt', 'DESC']
                ]
            }]
        });
        res.status(200).json({
            success: true,
            message: "Card fetched successfully!",
            data: cards
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// Cascade Delete is on cardsData and step will also delete
exports.deleteCard = async (req, res) => {
    try {
        const cards = await Cards.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!cards) {
            return res.sendStatus(401);
        }
        if (cards.iconImage_FileName) {
            await s3DeleteObject(cards.iconImage_FileName);
        }
        await cards.destroy();
        res.status(200).json({
            success: true,
            message: "Card deleted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.updateCard = async (req, res) => {
    try {
        const { error } = createCard(req.body);
        if (error) {
            if (req.file) {
                deleteSingleFile(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const cards = await Cards.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!cards) {
            return res.sendStatus(401);
        }
        const { titleEnglish, titleHindi, time, bgColor1, bgColor2, iconText, image_url } = req.body;
        let iconImage_OriginalName = cards.iconImage_OriginalName;
        let iconImage_FileName = cards.iconImage_FileName;
        let iconImage_Path = cards.iconImage_Path;
        let cloudinaryFileId = cards.cloudinaryFileId;
        if (req.file) {
            const imagePath = `./Resources/${req.file.filename}`
            const response = await cloudinary.uploader.upload(imagePath);
            deleteSingleFile(req.file.path);
            if (cards.cloudinaryFileId) {
                await cloudinary.uploader.destroy(cards.cloudinaryFileId);
            }
            iconImage_OriginalName = req.file.originalname;
            iconImage_FileName = req.file.filename;
            iconImage_Path = response.secure_url;
            cloudinaryFileId = response.public_id;
        }
        await cards.update({
            ...cards,
            cloudinaryFileId: cloudinaryFileId,
            image_url: image_url,
            titleEnglish: titleEnglish,
            time: time,
            titleHindi: titleHindi,
            bgColor1: bgColor1,
            bgColor2: bgColor2,
            iconText: iconText,
            iconImage_OriginalName: iconImage_OriginalName,
            iconImage_FileName: iconImage_FileName,
            iconImage_Path: iconImage_Path,
        });
        res.status(200).json({
            success: true,
            message: "Card upadted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}