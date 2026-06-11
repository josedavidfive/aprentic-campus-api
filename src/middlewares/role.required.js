// Comprueba que el usuario tiene el rol necesario para esa ruta

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permisos suficientes' });
        }
        next();
    };
};