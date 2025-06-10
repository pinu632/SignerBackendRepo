import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'



dotenv.config({
    path:'./.env'
})

const PORT = process.env.PORT



const app = express()


// app.use(bodyParser())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: true }));



import './config/passport.config.js'



import fileRouter from './routes/file.routes.js'
import authRoutes from './routes/auth.routes.js'
import documentRoutes from './routes/document.routes.js'
import { ConnectMongoDB } from './config/DB.config.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'


app.use('/api/file',fileRouter);
app.use('/api/auth',authRoutes)
app.use('/api/document',documentRoutes)




app.listen(PORT,()=>{
    ConnectMongoDB()
    console.log("server has started at port "+ PORT)
})