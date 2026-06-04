/* import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 3000
export const MONGODB_URI = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET */

require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET
}