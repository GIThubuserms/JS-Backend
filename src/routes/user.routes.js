import {Router} from "express"
import { RegisterUser,LoginUser, Logout ,NewRefreshToken,UpdatePassword,
        GetCurrentUser,UpdateAccountDetails,UpdateAvatar,UpdateCoverImage,
        GetUserProfile,GetWatchistory} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyuser } from "../middlewares/Auth.middleware.js"


export  const userrouter=Router()

// this upload logic acts as an middleware bcz we want to upload the files to our public folder here the upload
// fields will upload the avatar image and cover image  to our folder from cloudinry we make the upload fn and cloudinary 
// response is added to db :)

userrouter.route('/register').post(upload.fields([{name:'avatar', maxCount:1},{name:'coverimage',maxCount:1}]),RegisterUser)
userrouter.route('/login').post(LoginUser)

// secured routes
userrouter.route('/logout').post(verifyuser,Logout)
userrouter.route('/refreshToken').post(NewRefreshToken)
userrouter.route('/changepassword').post(verifyuser,UpdatePassword)
userrouter.route('/getcurrentuser').post(verifyuser,GetCurrentUser)
userrouter.route('/changeaccountdetails').post(verifyuser,UpdateAccountDetails)
userrouter.route('/changeavatar').post(verifyuser,upload.single('avatar'),UpdateAvatar)
userrouter.route('/changecoverimage').post(verifyuser,upload.single('coverimage'),UpdateCoverImage)
userrouter.route('/getchannel/:username').post(verifyuser,GetUserProfile)
userrouter.route('/getwatchistory').post(verifyuser,GetWatchistory)
