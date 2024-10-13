"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_1 = __importDefault(require("../models/contact"));
const helpers_1 = require("./helpers");
const router = express_1.default.Router();
// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Identify endpoint
router.post('/', asyncHandler(async (req, res) => {
    const { email, phoneNumber } = req.body;
    // Find existing contacts
    const existingEmailContact = await contact_1.default.findOne({ where: { email } });
    const existingPhoneContact = await contact_1.default.findOne({ where: { phoneNumber } });
    // New contact entry
    const newContact = contact_1.default.build({ email, phoneNumber, linkPrecedence: 'primary', createdAt: new Date() });
    // Link contacts if found match between existing records
    if (existingEmailContact != null && existingPhoneContact != null && existingEmailContact.id != existingPhoneContact.id) {
        await (0, helpers_1.linkContact)(existingPhoneContact, existingEmailContact);
        await (0, helpers_1.updateLinkedIds)(existingPhoneContact, existingEmailContact.id);
    }
    //Do nothing if incoming contact details are already in db
    if ((existingEmailContact != null && existingPhoneContact != null)
        || (newContact.phoneNumber == null || newContact.email == null)) {
        newContact.linkedId =
            existingEmailContact?.linkedId || existingEmailContact?.id || existingPhoneContact?.id || existingPhoneContact?.linkedId;
    }
    //if either email or phone matches, add request as secondary contact
    else if (existingEmailContact || existingPhoneContact) {
        await (0, helpers_1.linkContact)(newContact, existingEmailContact || existingPhoneContact);
    }
    //Save as primary contact if no link found
    else {
        await newContact.save(); // Treat as new if no matching contact
    }
    // Return the consolidated contact info
    const consolidatedContact = await (0, helpers_1.consolidateContact)(newContact);
    return res.json({ contact: consolidatedContact });
}));
exports.default = router;
