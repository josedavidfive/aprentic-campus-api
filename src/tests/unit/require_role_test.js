const requireRole = require('../../middlewares/role.required');

const fakeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('requireRole', () => {
  it('Llamamos a next() si el rol está permitido', () => {
    const req = { user: { rol: 'admin' } };
    const res = fakeRes();
    const next = jest.fn();
    requireRole('admin')(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('Devuelve 403 si el rol no está permitido', () => {
    const req = { user: { rol: 'profesor' } };
    const res = fakeRes();
    const next = jest.fn();
    requireRole('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});