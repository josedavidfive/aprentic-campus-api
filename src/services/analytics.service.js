const Proyecto = require('../models/Proyecto');
const Alumno = require('../models/Alumno');

// ─────────────────────────────────────────────
// FUNCIÓN 1: Porcentaje de aptos por campus
// ─────────────────────────────────────────────
const aptosPorCampus = () => Proyecto.aggregate([

    // PASO 1: El array notas tiene varios elementos por proyecto.
    // $unwind lo "abre" y crea un documento separado por cada nota.
    { $unwind: '$notas' },

    // PASO 2: Cada nota solo tiene el ID del alumno.
    // $lookup hace un "join" con la colección alumnos para traer sus datos completos.
    // Resultado: añade un campo alumnoData con los datos del alumno.
    {
        $lookup: {
            from: 'alumnos',            // colección con la que hacemos el join
            localField: 'notas.alumno', // campo local que contiene el ID
            foreignField: '_id',        // campo en alumnos que coincide con ese ID
            as: 'alumnoData'            // nombre del campo donde se guardan los resultados
        }
    },

    // PASO 3: $lookup devuelve un array aunque solo haya un resultado.
    // $unwind lo convierte en objeto simple para poder acceder a sus campos.
    { $unwind: '$alumnoData' },

    // PASO 4: El alumno tiene el ID de su promoción.
    // Hacemos otro join para traer los datos completos de la promoción.
    {
        $lookup: {
            from: 'promocions',                 // MongoDB pluraliza el modelo Promocion así
            localField: 'alumnoData.promocion', // ID de la promoción que tiene el alumno
            foreignField: '_id',
            as: 'promocionData'
        }
    },

    { $unwind: '$promocionData' },

    // PASO 5: La promoción tiene el ID del campus.
    // Hacemos otro join para traer el nombre del campus.
    {
        $lookup: {
            from: 'campus',
            localField: 'promocionData.campus',
            foreignField: '_id',
            as: 'campusData'
        }
    },

    { $unwind: '$campusData' },

    // PASO 6: Agrupamos todos los documentos por nombre de campus.
    // Para cada campus calculamos el total de notas y cuántas son 'Apto'.
    {
        $group: {
            _id: '$campusData.nombre',
            // Cuenta todas las notas de ese campus
            total: { $sum: 1 },
            // Cuenta solo las que tienen estado 'Apto'
            // $cond es un if: si estado es 'Apto' suma 1, si no suma 0
            aptos: {
                $sum: {
                    $cond: [{ $eq: ['$notas.estado', 'Apto'] }, 1, 0]
                }
            }
        }
    },

    // PASO 7: Damos forma al resultado final.
    // Renombramos _id a campus y calculamos el porcentaje.
    {
        $project: {
            campus: '$_id',
            total: 1,
            aptos: 1,
            // Porcentaje = (aptos / total) * 100
            porcentajeAptos: {
                $multiply: [{ $divide: ['$aptos', '$total'] }, 100]
            }
        }
    }
]);


// ─────────────────────────────────────────────
// FUNCIÓN 2: Alumnos en riesgo (nota menor de 5)
// ─────────────────────────────────────────────
const alumnosEnRiesgo = () => Proyecto.aggregate([

    // PASO 1: Abre el array de notas, un documento por nota
    { $unwind: '$notas' },

    // PASO 2: Filtra y se queda solo con notas menores de 5
    { $match: { 'notas.nota': { $lt: 5 } } },

    // PASO 3: Join con alumnos para traer nombre y email
    {
        $lookup: {
            from: 'alumnos',
            localField: 'notas.alumno',
            foreignField: '_id',
            as: 'alumnoData'
        }
    },

    { $unwind: '$alumnoData' },

    // PASO 4: Agrupamos por alumno para no repetirlo
    // si tiene varias notas bajas en distintos proyectos
    {
        $group: {
            _id: '$alumnoData._id',
            // $first coge el primer valor del grupo
            nombre: { $first: '$alumnoData.nombre' },
            email: { $first: '$alumnoData.email' },
            // Calcula la media de todas sus notas bajas
            notaMedia: { $avg: '$notas.nota' }
        }
    }
]);


// ─────────────────────────────────────────────
// FUNCIÓN 3: Ranking de proyectos con más no aptos
// ─────────────────────────────────────────────
const rankingNoAptos = () => Proyecto.aggregate([

    // PASO 1: Abre el array de notas
    { $unwind: '$notas' },

    // PASO 2: Filtra y se queda solo con las notas 'No Apto'
    { $match: { 'notas.estado': 'No Apto' } },

    // PASO 3: Agrupa por proyecto y cuenta cuántos no aptos tiene cada uno
    {
        $group: {
            _id: '$_id',
            nombre: { $first: '$nombre' },
            totalNoAptos: { $sum: 1 }
        }
    },

    // PASO 4: Ordena de mayor a menor número de no aptos
    // -1 = descendente (más no aptos primero)
    { $sort: { totalNoAptos: -1 } }
]);


module.exports = { aptosPorCampus, alumnosEnRiesgo, rankingNoAptos };
// Exporta las tres funciones para que el controller de analytics pueda usarlas