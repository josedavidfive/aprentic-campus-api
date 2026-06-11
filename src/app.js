const express = require('express');
const cors = require('cors')
const authRoutes = require('./routes/auth.routes');
const alumnosRoutes = require('./routes/alumnos.routes');
const profesoresRoutes = require('./routes/profesores.routes');
const promocionesRoutes = require('./routes/promociones.routes');
const proyectosRoutes = require('./routes/proyectos.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./middlewares/errorHandler');
const { specs, swaggerUi } = require('./docs/swagger');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/analytics', analyticsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'AprenTIC Campus API funcionando' });
});

// Manejador de errores (siempre el último)
app.use(errorHandler);

module.exports = app;