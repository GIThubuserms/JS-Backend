import express, { urlencoded } from 'express' 
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app=express();

// we have to use app.use for middlewere configuration

app.use(cors({origin:process.env.CORS_ID}))
app.use(express.static('public'))
app.use(express.json({limit:'16kb'}))
app.use(urlencoded({extended:true,limit:'16kb'}))
app.use(cookieParser())


export default app;

