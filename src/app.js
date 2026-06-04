/* require('dns').setServers(['8.8.8.8']); */
/* 
import express from 'express'

const app = express() */

// Middlewares globales
/* app.use(express.json()) */

// Ruta de prueba
/* app.get('/', (req, res) => {
  res.json({ message: 'AprenTIC Campus API funcionando' })
})

export default app */


const express = require('express')

const app = express()

// Middlewares globales
app.use(express.json())

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'AprenTIC Campus API funcionando' })
})

module.exports = app