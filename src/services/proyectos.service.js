const Proyecto = require('../models/Proyecto');
const Alumno = require('../models/Alumno');

const obtenerProyectos = () => Proyecto.find().populate('promocion').populate('notas.alumno').populate('notas.profesor');
const obtenerProyectoPorId = (id) => Proyecto.findById(id).populate('promocion').populate('notas.alumno').populate('notas.profesor');

const crearProyecto = async (proyectoData) => {
    const alumnos = await Alumno.find({ promocion: proyectoData.promocion });
    const notas = alumnos.map(a => ({
        alumno: a._id,
        nota: null,
        estado: 'Pendiente',
        profesor: null
    }));
    return Proyecto.create({ ...proyectoData, notas });
};

const actualizarProyecto = (id, proyectoData) => Proyecto.findByIdAndUpdate(id, proyectoData, { new: true });
const eliminarProyecto = (id) => Proyecto.findByIdAndDelete(id);

const añadirNota = async (id, notaData) => {
    const proyectoExistente = await Proyecto.findOne({ _id: id, 'notas.alumno': notaData.alumno });

    if (proyectoExistente) {
        return Proyecto.findOneAndUpdate(
            { _id: id, 'notas.alumno': notaData.alumno },
            {
                $set: {
                    'notas.$.nota': notaData.nota,
                    'notas.$.estado': notaData.estado,
                    'notas.$.profesor': notaData.profesor
                }
            },
            { new: true }
        );
    }

    return Proyecto.findByIdAndUpdate(id, { $push: { notas: notaData } }, { new: true });
};

const actualizarNota = (id, notaId, notaData) => Proyecto.findOneAndUpdate(
    { _id: id, 'notas._id': notaId },
    { $set: { 'notas.$': notaData } },
    { new: true }
);
const inscribirAlumno = (id, alumnoId) =>
    Proyecto.findByIdAndUpdate(
        id,
        { $push: { notas: { alumno: alumnoId, nota: null, estado: 'Pendiente', profesor: null } } },
        { new: true }
    );

module.exports = { obtenerProyectos, obtenerProyectoPorId, crearProyecto, actualizarProyecto, eliminarProyecto, añadirNota, actualizarNota, inscribirAlumno };