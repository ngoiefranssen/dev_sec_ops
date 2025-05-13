'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('utilisateurs', {
      USER_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      USERNAME: {
        type: Sequelize.STRING(80),
        unique: true,
        allowNull: false,
      },

      EMAIL: {
        type: Sequelize.STRING(80),
        unique: true,
        allowNull: false
      },

      PASSWORD: {
        type: Sequelize.STRING(80),
        allowNull: false
      },

      NOM: Sequelize.STRING,
      PRENOM: Sequelize.STRING,
      TELEPHONE1: Sequelize.STRING,
      TELEPHONE2: Sequelize.STRING,
      PROFIL_PICTURE: Sequelize.STRING,
      ADRESSE: Sequelize.STRING,

      IS_DELETED: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('utilisateurs');
  }
};
