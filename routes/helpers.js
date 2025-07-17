"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkContact = linkContact;
exports.consolidateContact = consolidateContact;
exports.updateLinkedIds = updateLinkedIds;
// const Contact = require('../models/contact');
const contact_1 = __importDefault(require("../models/contact"));
// Helper to link contact
async function linkContact(contact, existingContact) {
    // If contact matches an existing one, link them
    if (existingContact) {
        contact.linkedId = existingContact.linkedId || existingContact.id;
        contact.linkPrecedence = 'secondary';
        contact.updatedAt = new Date();
    }
    await contact.save();
}
// Helper to consolidate contacts
async function consolidateContact(contact) {
    const primaryContact = await contact_1.default.findByPk(contact.linkedId || contact.id);
    const secondaryContacts = await contact_1.default.findAll({
        where: { linkedId: primaryContact?.id }
    });
    // Consolidating the response
    const uniqueEmails = new Set();
    uniqueEmails.add(primaryContact?.email);
    secondaryContacts.map(c => uniqueEmails.add(c.email));
    const uniqueNumbers = new Set();
    uniqueNumbers.add(primaryContact?.phoneNumber);
    secondaryContacts.map(c => uniqueNumbers.add(c.phoneNumber));
    const emails = Array.from(uniqueEmails);
    const phoneNumbers = Array.from(uniqueNumbers);
    const secondaryContactIds = secondaryContacts.map(c => c.id);
    return {
        primaryContatctId: primaryContact?.id,
        emails: emails,
        phoneNumbers: phoneNumbers,
        secondaryContactIds: secondaryContactIds
    };
}
async function updateLinkedIds(contact, newLinkId) {
    const linkedContacts = await contact_1.default.findAll({
        where: { linkedId: contact.id }
    });
    linkedContacts.forEach(contact => {
        contact.linkedId = newLinkId;
        contact.save();
    });
}
