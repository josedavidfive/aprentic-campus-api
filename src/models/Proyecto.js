const mongoose = require('mongoose')

const notaSchema = new mongoose.Schema({
  alumno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', required: true },
  nota: { type: Number, required: true, min: 0, max: 10 },
  estado: { type: String, enum: ['Apto', 'No Apto', 'Pendiente'], required: true },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', required: true }
}, { timestamps: true })

const proyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  promocion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promocion', required: true },
  notas: [notaSchema]
}, { timestamps: true })

module.exports = mongoose.model('Proyecto', proyectoSchema)