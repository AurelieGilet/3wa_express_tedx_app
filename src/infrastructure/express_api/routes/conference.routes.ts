import express from 'express';
import { changeDates, changeSeats, organizeConference } from '../controller/conference.controllers';
import { isAuthenticated } from '../middlewares/authentication.middleware';
import container from '../config/dependency-injection';

const router = express.Router();

router.use(isAuthenticated);
router.post('/conference', organizeConference(container));
router.patch('/conference/seats/:id', changeSeats(container));
router.patch('/conference/dates/:id', changeDates(container));

export default router;
