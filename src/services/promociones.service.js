const Promocion = require('../models/Promocion');

//populate es para que devuelva el campus completo, no solo el id
const obtenerPromociones = () => Promocion.find().populate('campus');
const obtenerPromocionPorId = (id) => Promocion.findById(id).populate('campus');
const crearPromocion = (promocionData) => Promocion.create(promocionData);
const actualizarPromocion = (id, promocionData) => Promocion.findByIdAndUpdate(id, promocionData, { new: true });
const eliminarPromocion = (id) => Promocion.findByIdAndDelete(id);

module.exports = { obtenerPromociones, obtenerPromocionPorId, crearPromocion, actualizarPromocion, eliminarPromocion };