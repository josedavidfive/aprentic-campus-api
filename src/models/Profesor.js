const mongoose = require('mongoose')

const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true })

module.exports = mongoose.model('Profesor', profesorSchema)