import express from 'express';
const router = express.Router();
import {
    showListphoneNumbers,
    searchPhoneNumber,
    bookPhoneNumber,
    listNicePhoneNumbers,
    searchNicePhoneNumbers,
    bookNicePhoneNumber,
} from '../controllers/tplusBook.Controller';

router.get('/list-all-phone_number/:id', showListphoneNumbers);
router.post('/search-phone_number', searchPhoneNumber);
router.post('/book-phone_number', bookPhoneNumber);

router.get('/list-all/nice-phone_number/:id', listNicePhoneNumbers);
router.post('/search-nice-phone_number', searchNicePhoneNumbers);
router.post('/book-nice-phone_number', bookNicePhoneNumber);


export default router;