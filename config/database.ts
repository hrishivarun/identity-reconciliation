import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
let db_key = process.env.DATABASE_KEY || "mQamLcw718irHVvmV6SKOQ5Sh0Xzs1Oi";

const sequelize = new Sequelize('bitespeed_db_912b', 'root', db_key, {
    host: 'postgresql://root:mQamLcw718irHVvmV6SKOQ5Sh0Xzs1Oi@dpg-cs5vnjt6l47c73f90ca0-a.frankfurt-postgres.render.com/bitespeed_db_912b',
    dialect: 'postgres',
    port: 5432
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    }); 

export default sequelize;
