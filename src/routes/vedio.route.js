import { Router } from "express";
import {UploadVedio,EditVedio,DeleteVedio,
    GetVedioById,GetAllVedios,TogglePublishStatus} from '../controllers/vedio.controller.js'


export const Vediorouter=new Router()

Vediorouter.route('/uploadvedio').post(UploadVedio)
Vediorouter.route('/editvedio').post(EditVedio)
Vediorouter.route('/deletevedio').post(DeleteVedio)
Vediorouter.route('/getvediobyid').post(GetVedioById)
Vediorouter.route('/getallvedio').post(GetAllVedios)
Vediorouter.route('/togglepublishstatus').post(TogglePublishStatus)