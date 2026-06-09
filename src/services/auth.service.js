const Usuario = require('../models/Usuario');

const obtenerUsuarioPorEmail = (email) => Usuario.findOne({ email });
const crearUsuario = (usuarioData) => Usuario.create(usuarioData);

module.exports = { obtenerUsuarioPorEmail, crearUsuario };