const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bitespeed_db', 'root', 'Hrishi@3688', {
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;
