import { Router } from "express";
import {UploadVedio,EditVedio,DeleteVedio,
    GetVedioById,GetAllVedios,TogglePublishStatus} from '../controllers/vedio.controller.js'
import {verifyuser} from '../middlewares/Auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

export const Vediorouter=new Router()

Vediorouter.route('/uploadvedio').post(verifyuser,upload.fields([{name:"Vediofile",maxCount:1},{name:"Thumbnail",maxCount:1}]),UploadVedio)
Vediorouter.route('/editvedio/:vedioId').post(verifyuser,upload.single('Thumbnail'),EditVedio)
Vediorouter.route('/deletevedio/:vedioId').post(verifyuser,DeleteVedio)
Vediorouter.route('/getvediobyid/:vedioId').post(GetVedioById)
Vediorouter.route('/getallvedio').post(GetAllVedios)
Vediorouter.route('/togglepublishstatus/:vedioId').post(verifyuser,TogglePublishStatus)