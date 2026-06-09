require('dns').setServers(['8.8.8.8']);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const csv = require('csv-parse/sync');
const fs = require('fs');

const Campus = require('../src/models/Campus');
const Promocion = require('../src/models/Promocion');
const Profesor = require('../src/models/Profesor');
const Usuario = require('../src/models/Usuario');
const Alumno = require('../src/models/Alumno');
const Proyecto = require('../src/models/Proyecto');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  // Limpia todas las colecciones antes de insertar
  await Promise.all([
    Campus.deleteMany(),
    Promocion.deleteMany(),
    Profesor.deleteMany(),
    Usuario.deleteMany(),
    Alumno.deleteMany(),
    Proyecto.deleteMany()
  ]);
  console.log('Base de datos limpiada');

  // Lee y parsea el CSV
  const path = require('path');
  const file = fs.readFileSync(path.join(__dirname, '../data/alumnos.csv'), 'utf-8');
  const rows = csv.parse(file, { columns: true, skip_empty_lines: true });

  // ── 1. CAMPUS únicos ──
  const campusUnicos = [...new Set(rows.map(r => r.campus))];
  const campusMap = {};
  for (const nombre of campusUnicos) {
    const c = await Campus.create({ nombre });
    campusMap[nombre] = c._id;
    console.log(`Campus creado: ${nombre}`);
  }

  // ── 2. PROMOCIONES únicas ──
  const promocionesUnicas = [...new Map(rows.map(r => [r.promocion, r])).values()];
  const promocionMap = {};
  for (const row of promocionesUnicas) {
    const p = await Promocion.create({
      nombre: row.promocion,
      fechaInicio: new Date(row.fecha_inicio_promocion),
      fechaFin: new Date(row.fecha_fin_promocion),
      campus: campusMap[row.campus]
    });
    promocionMap[row.promocion] = p._id;
    console.log(`Promoción creada: ${row.promocion}`);
  }

  // ── 3. PROFESORES únicos + sus Usuarios ──
  const profesoresUnicos = [...new Map(rows.map(r => [r.email_profesor, r])).values()];
  const profesorMap = {};
  for (const row of profesoresUnicos) {
    const passwordHash = await bcrypt.hash('profesor123', 10);
    const usuario = await Usuario.create({
      email: row.email_profesor,
      password: passwordHash,
      rol: 'profesor'
    });
    const profesor = await Profesor.create({
      nombre: row.nombre_profesor,
      email: row.email_profesor,
      usuario: usuario._id
    });
    profesorMap[row.email_profesor] = profesor._id;
    console.log(`Profesor creado: ${row.nombre_profesor}`);
  }

  // ── 4. USUARIO ADMIN ──
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  await Usuario.create({
    email: 'admin@aprentic.com',
    password: passwordAdmin,
    rol: 'admin'
  });
  console.log('Admin creado: admin@aprentic.com');

  // ── 5. ALUMNOS ──
  const alumnoMap = {};
  const alumnosUnicos = [...new Map(rows.map(r => [r.email_alumno, r])).values()];
  for (const row of alumnosUnicos) {
    const alumno = await Alumno.create({
      nombre: row.nombre_alumno,
      email: row.email_alumno,
      promocion: promocionMap[row.promocion]
    });
    alumnoMap[row.email_alumno] = alumno._id;
    console.log(`Alumno creado: ${row.nombre_alumno}`);
  }

  // ── 6. PROYECTOS con notas ──
  const proyectosUnicos = [...new Map(rows.map(r => [r.nombre_proyecto + r.promocion, r])).values()];
  for (const row of proyectosUnicos) {
    // Recoge todas las notas de ese proyecto en esa promoción
    const notasDelProyecto = rows
      .filter(r => r.nombre_proyecto === row.nombre_proyecto && r.promocion === row.promocion)
      .map(r => ({
        alumno: alumnoMap[r.email_alumno],
        nota: parseFloat(r.nota_proyecto),
        estado: r.estado,
        profesor: profesorMap[r.email_profesor]
      }));

    await Proyecto.create({
      nombre: row.nombre_proyecto,
      promocion: promocionMap[row.promocion],
      notas: notasDelProyecto
    });
    console.log(`Proyecto creado: ${row.nombre_proyecto} (${row.promocion})`);
  }

  console.log('\n✅ Seed completado con éxito');
  mongoose.disconnect();
};

run().catch(err => {
  console.error('Error en el seed:', err);
  mongoose.disconnect();
  process.exit(1);
});