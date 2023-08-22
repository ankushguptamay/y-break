module.exports = (sequelize, DataTypes) => {
    const CardsDatas = sequelize.define("cardsDatas", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        videoLink:{
            type:DataTypes.STRING(1234)
        },
        iconText: {
            type: DataTypes.STRING(1234)
        },
        overview:{
            type:DataTypes.TEXT
        }
    })
    return CardsDatas;
}