module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("users", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password:{
            type:DataTypes.STRING
        },
        age:{
            type:DataTypes.STRING
        },
        gender:{
            type:DataTypes.STRING
        },
        country:{
            type:DataTypes.STRING
        },
        city:{
            type:DataTypes.STRING
        }
    })
    return Users;
}