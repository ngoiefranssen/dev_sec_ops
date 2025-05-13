const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;
const Role = require('./Role_model');
const ProfilRole = require('./Profil_role_model');
const Utilisateur = require('./Utilisateur_model');
const ProfilUtilisateur = require('./Profil_utilisateur_model');

const Profil = sequelize.define('profils', {
    PROFIL_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    PROFIL_NOM: {
        type: DataTypes.STRING,
        unique: true,
    },

    DESCRIPTION: DataTypes.STRING,
}, {
    timestamps: false,
    initialAutoIncrement: 1,
})

Profil.belongsToMany(Role, { through: ProfilRole, foreignKey: 'PROFIL_ID', as: 'ROLES' })
Role.belongsToMany(Profil, { through: ProfilRole, foreignKey: 'ROLE_ID', as: 'ROLES' })

module.exports = Profil;