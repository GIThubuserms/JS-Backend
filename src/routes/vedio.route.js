import { Router } from "express";
import {UploadVedio,EditVedio,DeleteVedio,
    GetVedioById,GetAllVedios,TogglePublishStatus} from '../controllers/vedio.controller.js'
import {verifyuser} from '../middlewares/Auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

export const Vediorouter=new Router()

Vediorouter.route('/uploadvedio').post(verifyuser,upload.fields([{name:"vedio",maxCount:1},{name:"thumbnail",maxCount:1}]),UploadVedio)
Vediorouter.route('/editvedio').post(EditVedio)
Vediorouter.route('/deletevedio').post(DeleteVedio)
Vediorouter.route('/getvediobyid').post(GetVedioById)
Vediorouter.route('/getallvedio').post(GetAllVedios)
Vediorouter.route('/togglepublishstatus').post(TogglePublishStatus)