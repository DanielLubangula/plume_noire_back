import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadBook } from '../../controllers/public/books.controller.js';

describe('downloadBook controller', () => {
  let req, res, next;
  beforeEach(() => {
    req = { params: { id: 'fakeid' } };
    res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  it('returns 404 if book not found', async () => {
    const Book = await import('../../models/book.model.js');
    vi.spyOn(Book.default, 'findById').mockResolvedValueOnce(null);

    await downloadBook(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});