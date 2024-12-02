import { asyncHandler } from "../utils/Asynchandler.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from '../utils/Apiresponse.js'

export const createPlaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
    const user=req.user

    console.log("Name : "+name);
    console.log("Description : "+description);
    console.log("UserId : "+user._id);

    if(!(name && description)) throw new ApiError(400,"Name and Discription is Required !!")
    
    const newplaylist=await Playlist.create(
        name,
        description,
        vedios=[],
        owner=user._id
    )
    if(!newplaylist) throw new ApiError(502,"There was a error while creating a playlist !! ")

    const findNewPlaylist=await Playlist.findById(newplaylist._id)   
    if(!findNewPlaylist) throw new ApiError(402,"Playlist Not Fetching !!")
 
    res
    .status(200)
    .json(new ApiResponse(200,newplaylist,"Playlist Created Successfully"))

})
export const updatePlaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
    const {id}=req.params
})
export const deletePlaylist=asyncHandler(async(req,res)=>{
    const {id}=req.params
})
export const getPlaylistById=asyncHandler(async(req,res)=>{
    const{id}=req.params 
})
export const getAllPlaylistById=asyncHandler(async(req,res)=>{
    const {userId}=req.params

})


export const DeleteVedioFromPlaylist=asyncHandler(async(req,res)=>{
    const {vedioId,PlaylistId}=req.params
})
export const AddVedioToPlaylist=asyncHandler(async(req,res)=>{
    const {vedioId,PlaylistId}=req.params
})