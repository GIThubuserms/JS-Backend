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


// Import all routes 

import {userrouter} from './routes/user.routes.js'

app.use('/api/v1/users',userrouter)


// http://localhost:4000/api/v1/users/register
// http://localhost:4000/api/v1/users/login

export default app;

// app.get('register',(re,res)=>{
//  res.status(200).json({
//     message:'Ok'
// })
// })

// Now when we use route we divide it 3 task 
// we define post fn
// we define secondary route
// we define main route


