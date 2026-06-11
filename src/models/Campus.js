/* Por qué he creado Campus:

El PDF menciona campus constantemente: "tasa de aptos por campus", 
"filtrar por campus", etc. Aunque no lo lista explícitamente como recurso con CRUD, 
tiene sentido tenerlo como colección separada para no repetir el nombre del campus 
en cada promoción y cada alumno. Es parte de una buena normalización de los datos del CSV. */


const mongoose = require('mongoose')

const campusSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }
}, { timestamps: true })

module.exports = mongoose.model('Campus', campusSchema)