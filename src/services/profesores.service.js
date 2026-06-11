const Profesor = require('../models/Profesor');

const obtenerProfesores = () => Profesor.find().populate('usuario');
const obtenerProfesorPorId = (id) => Profesor.findById(id).populate('usuario');
const obtenerProfesorPorEmail = (email) => Profesor.findOne({ email });

const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const crearProfesor = async (profesorData) => {
  const { nombre, email, password } = profesorData;

  // Crea el usuario para login
  const passwordHash = await bcrypt.hash(password, 10);
  await Usuario.create({ email, password: passwordHash, rol: 'profesor' });

  // Crea el registro de profesor
  return Profesor.create({ nombre, email });
};

const actualizarProfesor = (id, profesorData) => Profesor.findByIdAndUpdate(id, profesorData, { new: true });
const eliminarProfesor = (id) => Profesor.findByIdAndDelete(id);

module.exports = { obtenerProfesores, obtenerProfesorPorId, obtenerProfesorPorEmail, crearProfesor, actualizarProfesor, eliminarProfesor };