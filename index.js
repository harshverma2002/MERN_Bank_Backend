import express from 'express';
import { config } from 'dotenv';
import userRouter from './routes/user.js'
import transactionRouter from './routes/transaction.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import Redis from 'ioredis';

config()

const app = express()

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PSWD
})
redis.on('connect', () => {
    console.log('Connected to Redis')
})

mongoose.connect(process.env.MONGO_URI,{
    dbName:'MERN-bank'
}).then((c)=>{
    console.log('Connected to MongoDB')
}).catch((e)=>{
    console.log(e)
})

app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello Worlds')
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/transaction', transactionRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port} \nLink: http://localhost:${port} `)
})