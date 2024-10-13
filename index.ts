// const express = require('express');
import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database';
import router from './routes/identify';

const app = express();
app.use(bodyParser.json());

sequelize.sync({ alter: true })  // For initial table creation
    .then(() => console.log("Database synced!"))
    .catch((err:Error) => console.error("Failed to sync database: ", err));

// Placeholder routes
app.use('/identify', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
