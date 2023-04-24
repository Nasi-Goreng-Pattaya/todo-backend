import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db'
import { userRouter } from './routes/UserRoutes'
import { errorHandler } from './middlewares/ErrorMiddleware'
import { taskRouter } from './routes/TaskRoutes'

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/user', userRouter)
app.use('/api/task', taskRouter)

app.use(errorHandler)
app.listen(port, () => console.log(colors.bgGreen(`Server started on port ${port}`)))