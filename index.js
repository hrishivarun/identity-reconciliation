"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("./config/database"));
const identify_1 = __importDefault(require("./routes/identify"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
database_1.default.sync({ alter: true }) // For initial table creation
    .then(() => console.log("Database synced!"))
    .catch((err) => console.error("Failed to sync database: ", err));
// Placeholder routes
app.use('/identify', identify_1.default);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
