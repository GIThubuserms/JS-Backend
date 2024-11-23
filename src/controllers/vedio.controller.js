import {Vedio} from '../models/vedio.model.js'
import {Cloudnairy_Uplaod} from '../utils/Fileupload.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/Apiresponse.js'
import { asyncHandler } from '../utils/Asynchandler.js'


export const UploadVedio=asyncHandler(async(req,res)=>{
   // Take vedio and thumnbnail from files
   // Take tittle,discriptions from body

    const {tittle,discription}=req.body
    if(!(tittle&&discription)) throw new ApiError(402,"Please Provide Vedio Tittle and Discription !!")
   
    const vedio=req.files?.[0]?.vedio
    const thumbnail=req.files?.[0]?.thumbnail
    if(!(vedio,thumbnail)) throw new ApiError(402,"Please Provide Vedio  and Thumnail !!")
    console.log("Vedio comming from req.files : "+vedio);


    const uploadedvedio=await Cloudnairy_Uplaod(vedio)
    const uploadedthumbnail=await Cloudnairy_Uplaod(thumbnail)
    if(!(uploadedthumbnail&&uploadedthumbnail)) throw new ApiError(400,"Vedio Not uploaded on Cloudinary !!")
    console.log("Vedio comming from Cloudinary : "+uploadedvedio);

    
    const dbvedio=await Vedio.create({
        Vediofile:uploadedvedio.url,
        Thumbnail:uploadedthumbnail.url,
        Title:tittle,
        Discription:discription,
        Duration:uploadedvedio.duration,
        Views:0,
        isPublished
    })


    if(!dbvedio) throw new ApiError(502,"Something Went wrong while uploading vedio !!")
    return res.status(200).json(
        new ApiResponse(200,{},"Vedio Uploaded Succesfully")
    )    
})

export const EditVedio=asyncHandler(async(req,res)=>{})

export const DeleteVedio=asyncHandler(async(req,res)=>{})

export const GetVedioById=asyncHandler(async(req,res)=>{})

export const GetAllVedios=asyncHandler(async(req,res)=>{})

export const TogglePublishStatus=asyncHandler(async(req,res)=>{})