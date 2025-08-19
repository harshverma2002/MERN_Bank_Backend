import express from 'express';
import { config } from 'dotenv';
import userRouter from './routes/user.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import Redis from 'ioredis';

config()

const app = express()

export const redis = new Redis({
    host: 'redis-14300.c261.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 14300,
    password: '3ZjUfqNbNoxL2ktNG7BYwtsiAWCB3Bxq'
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

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port} \nLink: http://localhost:${port} `)
})