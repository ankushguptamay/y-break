module.exports = (sequelize, DataTypes) => {
    const Steps = sequelize.define("steps", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        stepsArr: {
            type: DataTypes.JSON
        }
    })
    return Steps;
}