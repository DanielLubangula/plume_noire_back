import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSocials } from '../../controllers/public/socials.controller.js';

describe('getSocials controller', () => {
  let req, res, next;
  beforeEach(() => {
    req = { protocol: 'http', get: () => 'localhost:5000' };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  it('returns empty array when no admin', async () => {
    const Admin = await import('../../models/admin.model.js');
    vi.spyOn(Admin.default, 'findOne').mockResolvedValueOnce(null);

    await getSocials(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', data: { social_links: [] } }));
  });

  it('returns social links when present', async () => {
    const Admin = await import('../../models/admin.model.js');
    const sample = { social_links: [{ network: 'twitter', url: 'https://twitter.com/author' }] };
    vi.spyOn(Admin.default, 'findOne').mockResolvedValueOnce(sample);

    await getSocials(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', data: { social_links: sample.social_links } }));
  });
});