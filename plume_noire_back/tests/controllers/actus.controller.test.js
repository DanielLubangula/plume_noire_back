import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPublicActus, getPublicActu } from '../../controllers/public/actus.controller.js';

describe('public actus controllers', () => {
  let req, res, next;
  beforeEach(() => {
    req = { protocol: 'http', get: () => 'localhost:5000', query: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  it('returns empty list when no actus', async () => {
    const Actu = await import('../../models/actus.model.js');
    vi.spyOn(Actu.default, 'find').mockReturnValueOnce({ sort: () => ({ lean: () => [] }) });

    await getPublicActus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('returns single actu', async () => {
    const Actu = await import('../../models/actus.model.js');
    const sample = { _id: '1', titre: 'T', contenu: 'C', image: '', created_at: new Date() };
    vi.spyOn(Actu.default, 'findById').mockResolvedValueOnce(sample);

    req.params = { id: '1' };
    await getPublicActu(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});