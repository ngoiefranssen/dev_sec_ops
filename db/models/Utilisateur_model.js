const { DataTypes } = require('sequelize');
const ProfilUtilisateur = require('./Profil_utilisateur_model');
const Profil = require('./Profil_model');
const sequelize = require('./index').sequelize;

const Utilisateur = sequelize.define('utilisateurs', {
    USER_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    USERNAME: {
        type: DataTypes.STRING(80),
        unique: true,
        allowNull: false,
    },

    EMAIL: {
        type: DataTypes.STRING(80),
        unique: true,
        allowNull: false
    },

    PASSWORD: {
        type: DataTypes.STRING(80),
        allowNull: false
    },

    NOM: DataTypes.STRING,
    PRENOM: DataTypes.STRING,
    TELEPHONE1: DataTypes.STRING,
    TELEPHONE2: DataTypes.STRING,
    PROFIL_PICTURE: DataTypes.STRING,
    ADRESSE: DataTypes.STRING,

    IS_DELETED: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
    },
}, {
    timestamps: false,
})

Profil.belongsToMany(Utilisateur, { through: ProfilUtilisateur, foreignKey: 'PROFIL_ID', as: 'PROFILS' })
Utilisateur.belongsToMany(Profil, { through: ProfilUtilisateur, foreignKey: 'USER_ID', as: 'PROFILS' })

module.exports = Utilisateur;