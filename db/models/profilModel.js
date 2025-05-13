const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;
const Role = require('./roleModel');
const ProfilRole = require('./profilRoleModel');
const Utilisateur = require('./utilisateurModel');
const ProfilUtilisateur = require('./profilUtilisateurModel');

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