import express from 'express'

const app = express()

// Middlewares globales
app.use(express.json())

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'AprenTIC Campus API funcionando' })
})

export default app