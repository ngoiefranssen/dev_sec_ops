'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      ROLE_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ROLE_NOM: {
        type: Sequelize.STRING,
        unique: true
    },
    ROLE_DESCRIPTION: Sequelize.STRING,
     });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
