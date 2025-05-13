const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;
const Profil = require('./profilModel');
const Role = require('./roleModel');

const ProfilRole = sequelize.define('profil_role', {
    PROFIL_ROLE_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    PROFIL_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Profil,
            key: 'PROFIL_ID',
        },
    },
    ROLE_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'ROLE_ID',
        },
    },
}, {
    timestamps: false,
    tableName: 'profil_role'
});

module.exports = ProfilRole;