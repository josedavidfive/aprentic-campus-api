const Proyecto = require('../models/Proyecto');

const obtenerProyectos = () => Proyecto.find().populate('promocion').populate('notas.alumno').populate('notas.profesor');
const obtenerProyectoPorId = (id) => Proyecto.findById(id).populate('promocion').populate('notas.alumno').populate('notas.profesor');
const crearProyecto = (proyectoData) => Proyecto.create(proyectoData);
const actualizarProyecto = (id, proyectoData) => Proyecto.findByIdAndUpdate(id, proyectoData, { new: true });
const eliminarProyecto = (id) => Proyecto.findByIdAndDelete(id);
const añadirNota = (id, notaData) => Proyecto.findByIdAndUpdate(id, { $push: { notas: notaData } }, { new: true });
const actualizarNota = (id, notaId, notaData) => Proyecto.findOneAndUpdate(
    { _id: id, 'notas._id': notaId },
    { $set: { 'notas.$': notaData } },
    { new: true }
);

module.exports = { obtenerProyectos, obtenerProyectoPorId, crearProyecto, actualizarProyecto, eliminarProyecto, añadirNota, actualizarNota };