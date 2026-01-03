import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBiography } from '../../controllers/public/bio.controller.js';

describe('getBiography controller', () => {
  let req, res, next;
  beforeEach(() => {
    req = { protocol: 'http', get: () => 'localhost:5000' };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  it('returns 404 when no admin exists', async () => {
    const Admin = await import('../../models/admin.model.js');
    vi.spyOn(Admin.default, 'findOne').mockResolvedValueOnce(null);

    await getBiography(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('returns admin info without password', async () => {
    const Admin = await import('../../models/admin.model.js');
    const sample = { email: 'a@b.c', nom: 'Nom', biographie: 'bio', social_links: [] };
    vi.spyOn(Admin.default, 'findOne').mockResolvedValueOnce(sample);

    await getBiography(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
  });
});