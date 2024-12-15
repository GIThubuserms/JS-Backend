import { asyncHandler } from "../utils/Asynchandler.js";
import ApiResponse from "../utils/Apiresponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comments.model.js";
import mongoose from "mongoose";

export const AddComment=asyncHandler(async(req,res)=>{
    const {VedioId}=req.params
    const UserId=req.user._id
    const {content}=req.body
    if(!content) throw new ApiError(400,"PLease Provide the Comment Content")

    const NewComment=await Comment.create({
        vedio:VedioId,
        owner:UserId,
        content:content
    })

    if(!NewComment) throw new ApiError(502,"There was a Problem While Adding Comment")

     return res
     .status(200)
     .json(new ApiResponse(200,NewComment,"Comment Added Successfully!!"))
    
})

export const DeleteComment=asyncHandler(async(req,res)=>{
    const {CommentID}=req.params
    const DeletedComment=await Comment.findByIdAndDelete(CommentID)
    if(!DeletedComment) throw new ApiError(502,"There was a Error while Deleting Comment")
    res.status(200).json( new ApiResponse(200,{},"Comment Deleted Successfully "))
})

export const UpdateComment=asyncHandler(async(req,res)=>{
    const {CommentID}=req.params
    const {content}=req.body
    if(!content) throw new ApiError(402,"Comment Content Needed")
    const UpdatedComment=await Comment.findByIdAndUpdate(CommentID,{
        content:content
    },{
        new:true
    })
    if(!UpdatedComment) throw new ApiError(502,"There was Problem while Updating the Comment")
     res.status(200).json(new ApiResponse(200,{UpdatedComment},"Comment Updated Successfully"))
    })

export const GetVedioComment=asyncHandler(async(req,res)=>{
    const {VedioId}=req.params
    let {page,limit}=req.query
    page=Number(page) ||1
    limit=Number(limit) || 10
    let startIndex=(page-1)*limit   
    const VedioComment=await Comment.aggregate([
        {
            $match:{
                vedio:new mongoose.Types.ObjectId(VedioId)
            }
        },
        {
            $project:{
                content:1
            }
        },
        {
            $skip:startIndex
        },
        {
            $limit:limit
        }
    ])

    if(!VedioComment.length<0) throw new ApiError(502,"There was a Error while Loading Comments ")
        res.status(200).json(new ApiResponse(200,VedioComment,"Comments Loaded Successfully "))
})