"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('bitespeed_db', 'root', 'Hrishi@3688', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
});
sequelize.authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
exports.default = sequelize;
