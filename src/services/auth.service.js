const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const register = async ({ email, password, rol }) => {
    // Comprueba si ya existe un usuario con ese email
    const existe = await Usuario.findOne({ email });
    if (existe) throw new Error('Ya existe un usuario con ese email');

    // Hashea la contraseña antes de guardarla (nunca se guarda en texto plano)
    const passwordHash = await bcrypt.hash(password, 10);

    // Crea el usuario con la contraseña hasheada
    const usuario = await Usuario.create({ email, password: passwordHash, rol });

    // Devuelve el usuario sin la contraseña
    return { _id: usuario._id, email: usuario.email, rol: usuario.rol };
};

const login = async ({ email, password }) => {
    // Busca el usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) throw new Error('Credenciales incorrectas');

    // Compara la contraseña que llega con el hash guardado
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) throw new Error('Credenciales incorrectas');

    // Genera el token JWT con los datos del usuario
    // El token expira en 24 horas
    const token = jwt.sign(
        { _id: usuario._id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { token, usuario: { _id: usuario._id, email: usuario.email, rol: usuario.rol } };
};

module.exports = { register, login };