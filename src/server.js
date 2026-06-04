/* require('dns').setServers(['8.8.8.8']); */

/* import app from './app.js'
import { connectDB } from './config/db.js'
import { PORT } from './config/env.js'
const express = require('express');
require('dotenv').config();

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
}) */

const app = require('./app')
const { connectDB } = require('./config/db')
const { PORT } = require('./config/env')

connectDB()

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})