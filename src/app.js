import express, { urlencoded } from 'express' 
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app=express();

// we have to use app.use for middlewere configuration
// KEYWORD TO REM :-  CJUSC (cross,json,url,static,cookie) 

app.use(cors({origin:process.env.CORS_ID}))  // for cross origins like testing and frontend
app.use(express.static('public'))   // for file uploading multer
app.use(express.json({limit:'16kb'}))        // form data conversion (comming from json)
app.use(urlencoded({extended:true,limit:'16kb'}))   // url means req.params
app.use(cookieParser())        // for cokkie data getting

// Import all routes 

import {userrouter} from './routes/user.routes.js'
import {Vediorouter} from './routes/vedio.route.js'
import {Playlistrouter} from './routes/playlist.route.js';
import {subscriptionRouter} from './routes/subscriptionRouter.route.js';

app.use('/api/v1/users',userrouter)
app.use('/api/v1/vedios',Vediorouter)
app.use('/api/v1/playlist',Playlistrouter)
app.use('/api/v1/subscription',subscriptionRouter)

export default app;

// http://localhost:4000/api/v1/users/register
// http://localhost:4000/api/v1/users/login
// http://localhost:4000/api/v1/vedios/uploadvedios

// app.get('register',(re,res)=>{
//  res.status(200).json({
//     message:'Ok'
// })
// })

// Now when we use route we divide it 3 task 
// we define post fn
// we define secondary route
// we define main route