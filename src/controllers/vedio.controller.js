import {Vedio} from '../models/vedio.model.js'
import {Cloudnairy_Uplaod} from '../utils/Fileupload.js'
import {ApiError} from '../utils/ApiError.js'
import ApiResponse from '../utils/Apiresponse.js'
import { asyncHandler } from '../utils/Asynchandler.js'


export const UploadVedio=asyncHandler(async(req,res)=>{
   // Take vedio and thumnbnail from files
   // Take tittle,discriptions from body
    
    const {Title,Discription}=req.body
    if(!(Title&&Discription)) throw new ApiError(402,"Please Provide Vedio Tittle and Discription !!")
    // console.log("TESTING TIITLE COMPLETE");

    //  console.log(req.files);
     
    const vedio=req.files?.Vediofile?.[0]?.path
    const thumbnail=req.files?.Thumbnail?.[0]?.path
    if(!(vedio,thumbnail)) throw new ApiError(402,"Please Provide Vedio and Thumnail !!")
    // console.log("Vedio comming from req.files : "+vedio);
    // console.log("TESTING MULTER COMPLETE");

    const uploadedvedio=await Cloudnairy_Uplaod(vedio)
    const uploadedthumbnail=await Cloudnairy_Uplaod(thumbnail)
    if(!(uploadedthumbnail&&uploadedthumbnail)) throw new ApiError(400,"Vedio Not uploaded on Cloudinary !!")
    console.log("Vedio comming from Cloudinary : "+uploadedvedio);

    // console.log("TESTING CLOUINARY COMPLETE");

    const dbvedio=await Vedio.create({
        Vediofile:uploadedvedio.url,
        Thumbnail:uploadedthumbnail.url,
        Title:Title,
        Discription,
        Duration:uploadedvedio.duration,
    })
    if(!dbvedio) throw new ApiError(502,"Something Went wrong while uploading vedio !!")


    const dbincomingvedio=await Vedio.findById(dbvedio._id).select('-isPublished')
    if(!dbincomingvedio) throw new ApiError(402,"Vedio Not found !!")

    return res.status(200).json(
        new ApiResponse(200,dbincomingvedio,"Vedio Uploaded Succesfully")
    )    
})

export const EditVedio=asyncHandler(async(req,res)=>{

    const {Title,Discription}=req.body
    const Thumbnail=req.file?.path
    const {vedioId}=req.params

    console.log("THUMBNAIL  :  "+ Thumbnail)

    if(!(Title && Discription)) throw new ApiError(400,"Tittle and discription is required !!")
    if(!Thumbnail) throw new ApiError(400,"Thumbnail is required !!")

    const updatedThumnbail=await Cloudnairy_Uplaod(Thumbnail)
    if(!updatedThumnbail) throw new ApiError(400,"Thumbnail Not Updated on Cloudinary !!")
    
   const updatedVedio=await Vedio.findByIdAndUpdate(vedioId,{
    $set:{
        Title:Title,
        Discription:Discription,
        Thumbnail:updatedThumnbail.url
    },
   },{
    new:true,
   }).select('Thumbnail Title Discription')

   if(!updatedVedio) throw new ApiError(200,"Credentials not updated")


res.status(200)
.json(
    new ApiResponse(200,updatedVedio,"Vedio Credentials Updated Succesfully ")
)
})

export const DeleteVedio=asyncHandler(async(req,res)=>{
    
})

export const GetVedioById=asyncHandler(async(req,res)=>{})

export const GetAllVedios=asyncHandler(async(req,res)=>{})

export const TogglePublishStatus=asyncHandler(async(req,res)=>{})