module.exports = (sequelize, DataTypes) => {
    const UserOTP = sequelize.define("userOTPs", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        otp: {
            type: DataTypes.INTEGER,
        },
        validTill: {
            type: DataTypes.STRING
        },
        userId: {
            type: DataTypes.STRING
        }
    })
    return UserOTP;
}