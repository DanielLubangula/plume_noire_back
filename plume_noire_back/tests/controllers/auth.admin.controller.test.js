import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteSocials } from '../../controllers/admin/auth.admin.controller.js';
import Admin from '../../models/admin.model.js';

describe('deleteSocials', () => {
  let req, res, next;
  beforeEach(() => {
    req = { body: { networks: ['twitter'] }, admin: { _id: 'id', social_links: [{ network: 'twitter', url: 't' }, { network: 'github', url: 'g' }] } };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  it('removes specified networks', async () => {
    vi.spyOn(Admin, 'findByIdAndUpdate').mockResolvedValueOnce({ social_links: [{ network: 'github', url: 'g' }] });

    await deleteSocials(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', message: 'Réseaux supprimés' }));
  });
});