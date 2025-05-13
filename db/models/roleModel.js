const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const Role = sequelize.define('roles', {
    ROLE_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ROLE_NOM: {
        type: DataTypes.STRING,
        unique: true
    },
    ROLE_DESCRIPTION: DataTypes.STRING,
}, {
    timestamps: false,
    initialAutoIncrement: 1,

})

module.exports = Role;