module.exports = (sequelize, DataTypes) => {
    const Cards = sequelize.define("cards", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        titleEnglish: {
            type: DataTypes.STRING
        },
        titleHindi: {
            type: DataTypes.STRING
        },
        iconImage_Path: {
            type: DataTypes.STRING(1234)
        },
        iconImage_FileName: {
            type: DataTypes.STRING(1234)
        },
        iconImage_OriginalName: {
            type: DataTypes.STRING(1234)
        },
        time: {
            type: DataTypes.STRING
        },
        video:{
            type:DataTypes.STRING(1234)
        },
        bgColor1: {
            type: DataTypes.STRING
        },
        bgColor2: {
            type: DataTypes.STRING
        },
        iconText: {
            type: DataTypes.STRING(1234)
        },
        image_url: {
            type: DataTypes.STRING(1234)
        }
    })
    return Cards;
}