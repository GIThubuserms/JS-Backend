import { asyncHandler } from "../utils/Asynchandler.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from '../utils/Apiresponse.js'
import mongoose from "mongoose";

export const createPlaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
    const user=req.user
 
    

    console.log("Name : "+name);
    console.log("Description : "+description);
    console.log("UserId : "+user._id);
    

    if(!(name && description)) throw new ApiError(400,"Name and Discription is Required !!")
    
    const newplaylist=await Playlist.create({
        name,
        description,
        owner:user._id
    })


    if(!newplaylist) throw new ApiError(502,"There was a error while creating a playlist !! ")

    const findNewPlaylist=await Playlist.findById(newplaylist._id)   
    console.log("New playlist : "+findNewPlaylist);
    
    if(!findNewPlaylist) throw new ApiError(402,"Playlist Not Fetching !!")

    res
    .status(200)
    .json(new ApiResponse(200,newplaylist,"Playlist Fetched Successfully !!"))

})

export const updatePlaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
    const {id}=req.params
    if(!(name&&description)) throw new ApiError(200,"Name and Discription is required !!") 

   const updatedPlaylist=await Playlist.findByIdAndUpdate(id,
    {
    $set:{
        name:name,
        description:description
    }
   },
   {
    new:true
   }).select('name description')

   if(!updatePlaylist) throw new ApiError(502,"Credentials Were Not Updated !! ")
    
    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlaylist,"Playlist Credentials Updated "))
})

export const deletePlaylist=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const deletedplaylist=await Playlist.findByIdAndDelete (id)
    if(!deletePlaylist) throw new ApiError(402,"Playlist Not Found !")
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Playlist Deleted SuccessFully"))
})

export const getPlaylistById=asyncHandler(async(req,res)=>{
    // const{id}=req.params 
    // const Fetchedplaylist=await Playlist.aggregate([
    //     {
    //         $match:new mongoose.Types.ObjectId(id)
    //     },
    //     {
    //         $lookup:{
    //             from:"vedios",
    //             localField:"vedios._id",
    //             foreignField:'_id',
    //             as:"vedios",
    //             pipeline:[{
    //                 $lookup:{
    //                     from:"users",
    //                     localField:"owner",
    //                     foreignField:'_id',
    //                     as:"owner",
    //                 },
    //                 $project:{
    //                     username:1,
    //                     coverimage:1
    //                 }
    //             }],
    //         },
    //         pipeline:[{
    //             $project:{
    //                 Vediofile:1,
    //                 Title:1,
    //                 Discription:1
    //             }
    //         }]
    //     },
    // ])
    // if(!Fetchedplaylist) throw new ApiError(402,"Playlist Not Found !")
    // return res
    // .status(200)
    // .json(new ApiResponse(200,Fetchedplaylist,"Playlist Fetched SuccessFully"))
})

export const getAllPlaylistById=asyncHandler(async(req,res)=>{
    const {userId}=req.params
   

})


export const DeleteVedioFromPlaylist=asyncHandler(async(req,res)=>{
    const {vedioId,PlaylistId}=req.params
    if(!(vedioId && PlaylistId)) throw new ApiError(400,"Please Provide Vedio and Playlist !!")
    
    const PlaylistFromdb=await Playlist.findById(PlaylistId)
    if(!PlaylistFromdb) throw new ApiError(402,"Playlist Not found !!")
    
    PlaylistFromdb.vedios=PlaylistFromdb.vedios.filter((id)=>id.toString() !==vedioId.toString())
    console.log("Filter operated array : "+PlaylistFromdb.vedios);
    
    PlaylistFromdb.save({validateBeforeSave:false})
   
    res.status(200).json(new ApiResponse(200,{},"Vedio Deleted From Playlist Successfully "))
    
})

export const AddVedioToPlaylist=asyncHandler(async(req,res)=>{
    const {vedioId,PlaylistId}=req.params
    if(!(vedioId && PlaylistId)) throw new ApiError(400,"Please Provide Vedio and Playlist !!")
    
    const PlaylistFromdb=await Playlist.findById(PlaylistId)
    if(!PlaylistFromdb) throw new ApiError(402,"Playlist Not found !!")
    
    PlaylistFromdb.vedios=PlaylistFromdb.vedios.push(vedioId)
    PlaylistFromdb.save({validateBeforeSave:false})
   
    res.status(200).json(new ApiResponse(200,{},"Vedio Added To Playlist Successfully "))
    
})