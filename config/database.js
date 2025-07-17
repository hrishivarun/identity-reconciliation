"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let db_key = process.env.DATABASE_KEY || "mQamLcw718irHVvmV6SKOQ5Sh0Xzs1Oi";
// Connection string for PostgreSQL hosted on Render
const sequelize = new sequelize_1.Sequelize('postgresql://root:mQamLcw718irHVvmV6SKOQ5Sh0Xzs1Oi@dpg-cs5vnjt6l47c73f90ca0-a.frankfurt-postgres.render.com/bitespeed_db_912b', {
    dialect: 'postgres',
    protocol: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true, // Enforce SSL connection
            rejectUnauthorized: false, // You may need this if Render requires a self-signed certificate
        },
    }, // Disable logging if not needed
});
// const sequelize = new Sequelize('bitespeed_db_912b', 'root', db_key, {
//     host: 'postgresql://root:mQamLcw718irHVvmV6SKOQ5Sh0Xzs1Oi@dpg-cs5vnjt6l47c73f90ca0-a/bitespeed_db_912b',
//     dialect: 'postgres',
//     port: 5432
// });
sequelize.authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
exports.default = sequelize;
