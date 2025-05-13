const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;
const Profil = require('./Profil_model');
const Utilisateur = require('./Utilisateur_model');

const ProfilUtilisateur = sequelize.define('profil_utilisateur', {
    PROFIL_USER_ID: {
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
    USER_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilisateur,
            key: 'USER_ID',
        },
    },
}, {
    timestamps: false,
    tableName: 'profil_utilisateur'
});

module.exports = ProfilUtilisateur;