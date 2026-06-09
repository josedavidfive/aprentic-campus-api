const jwt = require('jsonwebtoken');


// Comprueba si la petición lleva un token JWT válido en el header
module.exports = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Sin token' });

    try {
        const token = header.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};