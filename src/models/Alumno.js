const mongoose = require('mongoose')

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  foto: { type: String, default: null },
  promocion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promocion', required: true }
}, { timestamps: true })

module.exports = mongoose.model('Alumno', alumnoSchema)