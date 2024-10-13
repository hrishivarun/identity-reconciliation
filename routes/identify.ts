import express, {NextFunction, Request, Response} from 'express';
import Contact from '../models/contact';
import {linkContact, consolidateContact, updateLinkedIds} from'./helpers';
import ContactRequest from '../models/contactDto';

const router = express.Router();
// Error handling middleware
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
// Identify endpoint
router.post('/', asyncHandler(async (req: Request<{}, {}, ContactRequest>, res: Response) => {
    const { email, phoneNumber } = req.body;

    // Find existing contacts
    const existingEmailContact = await Contact.findOne({ where: { email } });
    const existingPhoneContact = await Contact.findOne({ where: { phoneNumber } });

    // New contact entry
    const newContact = Contact.build({ email, phoneNumber, linkPrecedence:'primary', createdAt: new Date()});

    // Link contacts if found match between existing records
    if(existingEmailContact!=null && existingPhoneContact!=null && existingEmailContact.id!=existingPhoneContact.id) {
      await linkContact(existingPhoneContact, existingEmailContact);
      await updateLinkedIds(existingPhoneContact, existingEmailContact.id);

      
    }

    //Do nothing if incoming contact details are already in db
    if((existingEmailContact!=null && existingPhoneContact!=null)
      || (newContact.phoneNumber==null || newContact.email==null )) {
        newContact.linkedId = 
          existingEmailContact?.linkedId || existingEmailContact?.id || existingPhoneContact?.id || existingPhoneContact?.linkedId;
    }
    //if either email or phone matches, add request as secondary contact
    else if (existingEmailContact || existingPhoneContact) { 
        await linkContact(newContact, existingEmailContact || existingPhoneContact);
    } 
    //Save as primary contact if no link found
    else {
        await newContact.save();  // Treat as new if no matching contact
    }

    // Return the consolidated contact info
    const consolidatedContact = await consolidateContact(newContact);
    return res.json({ contact: consolidatedContact });
}));

export default router;
