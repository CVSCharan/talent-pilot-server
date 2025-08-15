import { Router } from 'express';
import passport from 'passport';
import multer from 'multer';
import * as n8nController from '../controllers/n8nController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('document'),
  n8nController.handleWebhook
);

export default router;