const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Helper to link contact
async function linkContact(contact, existingContact) {
    // If contact matches an existing one, link them
    if (existingContact) {
        contact.linkedId = existingContact.linkedId || existingContact.id;
        contact.linkPrecedence = 'secondary';
        await contact.save();
    } else {
        await contact.save();  // Save as primary if it's new
    }
}

// Helper to consolidate contacts
async function consolidateContact(contact) {
    const primaryContact = await Contact.findByPk(contact.linkedId || contact.id);
    const secondaryContacts = await Contact.findAll({
        where: { linkedId: primaryContact.id }
    });

    // Consolidating the response
    const uniqueEmails = new Set();
    uniqueEmails.add(primaryContact.email);
    secondaryContacts.map(c => uniqueEmails.add(c.email));

    const uniqueNumbers = new Set();
    uniqueNumbers.add(primaryContact.phoneNumber);
    secondaryContacts.map(c => uniqueNumbers.add(c.phoneNumber));

    const emails = Array.from(uniqueEmails);
    const phoneNumbers = Array.from(uniqueNumbers);
    const secondaryContactIds = secondaryContacts.map(c => c.id);

    return {
        primaryContatctId: primaryContact.id,
        emails: emails,
        phoneNumbers: phoneNumbers,
        secondaryContactIds: secondaryContactIds
    };
}

// Identify endpoint
router.post('/', async (req, res) => {
    const { email, phoneNumber } = req.body;

    // Find existing contacts
    const existingEmailContact = await Contact.findOne({ where: { email } });
    const existingPhoneContact = await Contact.findOne({ where: { phoneNumber } });

    // New contact entry
    const newContact = Contact.build({ email, phoneNumber });

    // Link contacts if found
    if((existingEmailContact!=null && existingPhoneContact!=null)
      || (existingEmailContact!=null && newContact.phoneNumber==null) 
      || (existingPhoneContact!=null && newContact.email==null)) {
        newContact.linkedId = existingEmailContact?.linkedId || existingEmailContact?.id || existingPhoneContact?.id || existingPhoneContact?.linkedId;
    }else if (existingEmailContact || existingPhoneContact) {
        await linkContact(newContact, existingEmailContact || existingPhoneContact);
    } else {
        await newContact.save();  // Treat as new if no matching contact
    }

    // Return the consolidated contact info
    const consolidatedContact = await consolidateContact(newContact);
    return res.json({ contact: consolidatedContact });
});

module.exports = router;
