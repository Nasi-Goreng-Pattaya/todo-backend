import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db'

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => console.log(colors.bgGreen(`Server started on port ${port}`)))