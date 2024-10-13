
// const Contact = require('../models/contact');
import Contact from '../models/contact';

// Helper to link contact
export async function linkContact(contact: Contact, existingContact: Contact | null) {
  // If contact matches an existing one, link them
  if (existingContact) {
      contact.linkedId = existingContact.linkedId || existingContact.id;
      contact.linkPrecedence = 'secondary';
      contact.updatedAt=new Date();
  }
  await contact.save();
}

// Helper to consolidate contacts
export async function consolidateContact(contact: Contact) {
  const primaryContact = await Contact.findByPk(contact.linkedId || contact.id);
  const secondaryContacts = await Contact.findAll({
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

export async function updateLinkedIds(contact: Contact, newLinkId: number) {
  const linkedContacts = await Contact.findAll({
      where: { linkedId: contact.id }
  });

  linkedContacts.forEach(contact => {
    contact.linkedId = newLinkId;
    contact.save();
  });
}

