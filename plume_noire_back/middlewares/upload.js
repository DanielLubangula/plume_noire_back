import multer from 'multer';
import AppError from '../utils/app-error.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const { fieldname, mimetype } = file;
  if (fieldname === 'fichier_pdf') {
    if (mimetype !== 'application/pdf') return cb(new AppError(400, 'Le fichier PDF doit être au format PDF'), false);
  }
  if (fieldname === 'couverture' || fieldname === 'image') {
    if (!mimetype.startsWith('image/')) return cb(new AppError(400, 'La couverture / image doit être une image'), false);
  }
  cb(null, true);
};

const MAX_UPLOAD_SIZE_MB = process.env.MAX_UPLOAD_SIZE_MB ? Number(process.env.MAX_UPLOAD_SIZE_MB) : 50;
const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024 } });

export const uploadFields = upload.fields([
  { name: 'fichier_pdf', maxCount: 1 },
  { name: 'couverture', maxCount: 1 }
]);

export const uploadSingleImage = upload.single('image');

export default upload; 