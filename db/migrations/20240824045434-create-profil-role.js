'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profil_role', {
      PROFIL_ROLE_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      PROFIL_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'profils'
          },
          key: 'PROFIL_ID',
        },
      },
      ROLE_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'roles'
          },
          key: 'ROLE_ID',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('profil_role');
  }
};
