import  {Router} from 'express'
import { RegisterUser } from '../controllers/user.controller.js'

export const Userroute=Router()

Userroute.route('/register').post(RegisterUser)
