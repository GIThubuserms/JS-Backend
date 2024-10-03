import {Router} from "express"
import { RegisterUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"


export  const userrouter=Router()

userrouter.route('/register').post(
    upload.fields([
    {
        name:'avatar',
        maxCount:1
    },
     {
            name:'coverimage',
            maxCount:1
        }
    ]),RegisterUser)





// this upload logic acts as an middleware bcz we want to upload the files to our public folder here the upload
// fields will upload the avatar image and cover image  to our folder from cloudinry we make the upload fn and cloudinary 
// response is added to db :)

