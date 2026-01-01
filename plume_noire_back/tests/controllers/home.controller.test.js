import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHome } from '../../controllers/public/home.controller.js';

// Minimal unit test skeleton — requires installing vitest and running `vitest`.
// We will mock Author and Book models by stubbing their static methods.

describe('getHome controller', () => {
  let ctx;
  beforeEach(() => {
    ctx = {
      req: { protocol: 'http', get: () => 'localhost:5000' },
      res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      },
      next: vi.fn()
    };
  });

  it('returns default structure when no author/book exists', async () => {
    // Mock models
    const Author = await import('../../models/author.model.js');
    const Book = await import('../../models/book.model.js');

    vi.spyOn(Author.default, 'findOne').mockResolvedValueOnce(null);
    vi.spyOn(Book.default, 'find').mockResolvedValueOnce([]);

    const req = { protocol: 'http', get: () => 'localhost:5000' };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    await getHome(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});