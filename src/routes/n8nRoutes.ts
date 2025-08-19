import { Router } from 'express';
import passport from 'passport';
import multer from 'multer';
import * as n8nController from '../controllers/n8nController';
import { Request } from 'express';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter: fileFilter
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('document'),
  n8nController.handleWebhook
);

router.get(
  '/responses',
  passport.authenticate('jwt', { session: false }),
  n8nController.getN8nResponses
);

export default router;