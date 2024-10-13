"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Extend Sequelize's Model class with Contact attributess
class Contact extends sequelize_1.Model {
    id; // Non-nullable field
    phoneNumber;
    email;
    linkedId;
    linkPrecedence;
    createdAt;
    updatedAt;
    deletedAt;
}
exports.default = Contact;
