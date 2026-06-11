module.exports = (err, req, res, next) => {
    // Recibe cualquier error que los controllers pasen con next(err)
    console.error(err.message);

    // Devuelve el error con código 500 por defecto
    res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
};