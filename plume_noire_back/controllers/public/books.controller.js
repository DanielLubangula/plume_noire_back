import Book from '../../models/book.model.js';
import AppError from '../../utils/app-error.js';
import logger from '../../utils/logger.js';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { Readable } from 'stream';

const streamPipeline = promisify(pipeline);

/**
 * Télécharge un livre si le statut est 'gratuit'.
 * Si le livre est payant, renvoie un message indiquant que le livre est payant.
 * @route GET /api/public/livres/:id/telecharger
 */
export const downloadBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).lean();
    if (!book) return next(new AppError(404, 'Book not found'));

    if (book.statut !== 'gratuit') {
      return next(new AppError(403, 'Livre payant — téléchargement non autorisé pour le moment'));
    }

    if (!book.fichier_pdf || !book.fichier_pdf.length) {
      return next(new AppError(404, 'Fichier PDF introuvable pour ce livre'));
    }

    const fileUrl = book.fichier_pdf;

    // Build a safe filename ending with .pdf
    const baseName = book.titre ? book.titre.replace(/[^a-zA-Z0-9_\-\. ]/g, '') : 'book';
    const filename = `${baseName}.pdf`;

    // Use fetch to stream the remote file and pipe to response
    const remoteRes = await fetch(fileUrl);
    if (!remoteRes.ok) {
      logger.error({ status: remoteRes.status, url: fileUrl }, 'Failed to fetch remote file');
      return next(new AppError(502, 'Erreur lors du téléchargement du fichier distant'));
    }

    res.setHeader('Content-Type', 'application/pdf');
    // Use RFC5987 encoding for filename to be safe
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);

    const remoteBody = remoteRes.body;
    if (!remoteBody) return next(new AppError(500, 'Fichier distant invalide'));

    // remoteBody can be a WHATWG ReadableStream (no .pipe) or a Node stream
    let nodeStream = remoteBody;
    if (typeof remoteBody.pipe !== 'function') {
      if (typeof Readable.fromWeb === 'function' && typeof remoteBody.getReader === 'function') {
        nodeStream = Readable.fromWeb(remoteBody);
      } else {
        // fallback: buffer the response then send
        const arrayBuffer = await remoteRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.setHeader('Content-Length', buffer.length);
        return res.end(buffer);
      }
    }

    try {
      await streamPipeline(nodeStream, res);
    } catch (e) {
      logger.error({ err: e }, 'Error piping remote file to response');
      return next(new AppError(502, 'Erreur lors du streaming du fichier distant'));
    }
  } catch (err) {
    logger.error({ err }, 'Error in downloadBook');
    return next(new AppError(500, err.message));
  }
};

export default { downloadBook };