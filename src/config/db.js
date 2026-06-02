require('dns').setServers(['8.8.8.8']);

/* require('dns').setServers(['8.8.8.8']);
 */
/* import mongoose from 'mongoose'
import { MONGODB_URI } from './env.js' */

/* export const connectDB = async () => {
  try {
    /* console.log(process.env.MONGODB_URI); */
  //  await mongoose.connect(MONGODB_URI)
   // console.log('Conectado a MongoDB Atlas')
  //} catch (error) {
   // console.error('Error conectando a MongoDB:', error.message)
    //process.exit(1)
 // }
//} 


const mongoose = require('mongoose')
const { MONGODB_URI } = require('./env')

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Conectado a MongoDB Atlas')
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = { connectDB }