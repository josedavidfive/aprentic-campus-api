const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const newUsuario = await authService.register(req.body);
    res.status(201).json(newUsuario);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { token, usuario } = await authService.login(req.body);
    res.json({ token, usuario });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };