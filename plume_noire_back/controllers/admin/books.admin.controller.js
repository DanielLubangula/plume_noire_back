import Book from '../../models/book.model.js';
import AppError from '../../utils/app-error.js';
import { uploadBuffer, deleteResource } from '../../utils/cloudinary.js';
import logger from '../../utils/logger.js';

/**
 * Crée un nouveau livre (upload fichiers sur Cloudinary)
 * @route POST /api/admin/livres
 */
export const createBook = async (req, res, next) => {
  try {
    const { titre, description, extrait, statut, prix, is_featured } = req.body;

    const bookData = { titre, description, extrait, statut, prix: prix ? Number(prix) : 0 };

    // Accepter is_featured si fourni
    if (is_featured !== undefined) {
      bookData.is_featured = is_featured === true || is_featured === 'true';
    }

    // fichiers envoyés via multipart/form-data (multer memoryStorage)
    const files = req.files || {};

    // Ensure required files are present
    if (!files.fichier_pdf || !files.fichier_pdf[0] || !files.couverture || !files.couverture[0]) {
      return next(new AppError(400, 'Fichier PDF et couverture requis'));
    }

    if (files.fichier_pdf && files.fichier_pdf[0]) {
      const pdfFile = files.fichier_pdf[0];
      const uploadResult = await uploadBuffer(pdfFile.buffer, {
        folder: 'plume-noire/books/files',
        resource_type: 'raw'
      });
      bookData.fichier_pdf = uploadResult.secure_url;
      bookData.fichier_pdf_public_id = uploadResult.public_id;
    }

    if (files.couverture && files.couverture[0]) {
      const coverFile = files.couverture[0];
      const uploadResult = await uploadBuffer(coverFile.buffer, {
        folder: 'plume-noire/books/covers',
        resource_type: 'image'
      });
      bookData.couverture = uploadResult.secure_url;
      bookData.couverture_public_id = uploadResult.public_id;
    }

    const created = await Book.create(bookData);

    return res.status(201).json({ status: 'success', book: created });
  } catch (err) {
    logger.error({ err }, 'Error creating book');
    return next(new AppError(500, err.message));
  }
};

/**
 * Mettre à jour un livre
 * @route PUT /api/admin/livres/:id
 */
export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titre, description, extrait, statut, prix } = req.body;

    const book = await Book.findById(id);
    if (!book) return next(new AppError(404, 'Book not found'));

    const updateData = {};
    if (titre) updateData.titre = titre;
    if (description !== undefined) updateData.description = description;
    if (extrait !== undefined) updateData.extrait = extrait;
    if (statut) updateData.statut = statut;
    if (prix !== undefined) updateData.prix = Number(prix);
    if (req.body.is_featured !== undefined) updateData.is_featured = req.body.is_featured === true || req.body.is_featured === 'true';

    const files = req.files || {};

    if (files.fichier_pdf && files.fichier_pdf[0]) {
      const pdfFile = files.fichier_pdf[0];
      const uploadResult = await uploadBuffer(pdfFile.buffer, {
        folder: 'plume-noire/books/files',
        resource_type: 'raw'
      });
      updateData.fichier_pdf = uploadResult.secure_url;
      updateData.fichier_pdf_public_id = uploadResult.public_id;
    }

    if (files.couverture && files.couverture[0]) {
      const coverFile = files.couverture[0];
      const uploadResult = await uploadBuffer(coverFile.buffer, {
        folder: 'plume-noire/books/covers',
        resource_type: 'image'
      });
      updateData.couverture = uploadResult.secure_url;
      updateData.couverture_public_id = uploadResult.public_id;
    }

    if (Object.keys(updateData).length === 0) {
      return next(new AppError(400, 'Aucune modification fournie'));
    }

    await Book.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({ status: 'success', message: 'Book updated' });
  } catch (err) {
    logger.error({ err }, 'Error updating book');
    return next(new AppError(500, err.message));
  }
};

/**
 * Supprimer un livre
 * @route DELETE /api/admin/livres/:id
 */
export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return next(new AppError(404, 'Book not found'));

    // Supprimer les fichiers Cloudinary si présents
    if (book.fichier_pdf_public_id) {
      try {
        await deleteResource(book.fichier_pdf_public_id, { resource_type: 'raw' });
      } catch (e) {
        logger.warn({ err: e }, 'Erreur suppression fichier PDF sur Cloudinary');
      }
    }
    if (book.couverture_public_id) {
      try {
        await deleteResource(book.couverture_public_id, { resource_type: 'image' });
      } catch (e) {
        logger.warn({ err: e }, 'Erreur suppression couverture sur Cloudinary');
      }
    }

    await Book.findByIdAndDelete(id);

    return res.status(200).json({ status: 'success', message: 'Book deleted' });
  } catch (err) {
    logger.error({ err }, 'Error deleting book');
    return next(new AppError(500, err.message));
  }
};

/**
 * Récupère la liste des livres
 * @route GET /api/admin/livres
 * @returns {Promise<Object>} Liste des livres
 */
export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ created_at: -1 });
    return res.status(200).json({ status: 'success', data: { books } });
  } catch (err) {
    logger.error({ err }, 'Error fetching books');
    return next(new AppError(500, err.message));
  }
};

/**
 * Récupère un seul livre par id
 * @route GET /api/admin/livres/:id
 * @returns {Promise<Object>} Livre
 */
export const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return next(new AppError(404, 'Book not found'));

    return res.status(200).json({ status: 'success', data: { book } });
  } catch (err) {
    logger.error({ err }, 'Error fetching book');
    return next(new AppError(500, err.message));
  }
};

export default { createBook, updateBook, deleteBook, getBooks, getBook };
