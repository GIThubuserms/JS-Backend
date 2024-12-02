import { asyncHandler } from "../utils/Asynchandler";
import { Playlist } from "../models/playlist.model";

export const createPlaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
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