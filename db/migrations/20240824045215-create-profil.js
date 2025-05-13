'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('profils', {
      PROFIL_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      PROFIL_NOM: {
        type: Sequelize.STRING,
        unique: true,
      },

      DESCRIPTION: Sequelize.STRING,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('profils');
  }
};
