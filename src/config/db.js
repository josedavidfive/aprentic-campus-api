import mongoose from 'mongoose'
import { MONGODB_URI } from './env.js'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Conectado a MongoDB Atlas')
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message)
    process.exit(1)
  }
}