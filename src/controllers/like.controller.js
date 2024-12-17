import { Like } from "../models/likes.model.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import ApiResponse from "../utils/Apiresponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

export const ToggleVedioLike=asyncHandler(async(req,res)=>{
    const {vedioId}=req.params
    const user=req.user._id
  
    const Isvedioliked=await Like.findOne({
        likedby:user,
        vedio:vedioId  
    })
    if(Isvedioliked){ /* unlike functionality*/
      const VedioUnlike=await Like.findByIdAndDelete(Isvedioliked._id)
      if(!VedioUnlike) throw new ApiError(502,"There was a error while unlike a vedio")
      res.status(200).json(new ApiResponse(200,{},"Unliked"))
    }

    if(!Isvedioliked){ /*like functionality*/
     const VedioLike=await Like.create({
        likedby:user,
        vedio:vedioId
     })
     if(!VedioLike) throw new ApiError(502,"There was a error while like a vedio")
        res.status(200).json(new ApiResponse(200,{},"liked"))
    }
    
})

export const ToggleCommentLike=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    const user=req.user._id
  
    const Iscommentliked=await Like.findOne({
        likedby:user,
        comment:commentId  
    })
    if(Iscommentliked){ /* unlike functionality*/
      const commentUnlike=await Like.findByIdAndDelete(Iscommentliked._id)
      if(!commentUnlike) throw new ApiError(502,"There was a error while unlike a comment")
      res.status(200).json(new ApiResponse(200,{},"Unliked"))
    }

    if(!Iscommentliked){ /*like functionality*/
     const commentLike=await Like.create({
        likedby:user,
        comment:commentId
     })
     if(!commentLike) throw new ApiError(502,"There was a error while like a comment")
        res.status(200).json(new ApiResponse(200,{},"liked"))
    }
})

export const ToogleTweetLike=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    const user=req.user._id
  
    const Istweetliked=await Like.findOne({
        likedby:user,
        tweet:tweetId  
    })
    if(Istweetliked){ /* unlike functionality*/
      const tweetUnlike=await Like.findByIdAndDelete(Istweetliked._id)
      if(!tweetUnlike) throw new ApiError(502,"There was a error while unlike a tweet")
      res.status(200).json(new ApiResponse(200,{},"Unliked"))
    }

    if(!Istweetliked){ /*like functionality*/
     const tweetLike=await Like.create({
        likedby:user,
        tweet:tweetId
     })
     if(!tweetLike) throw new ApiError(502,"There was a error while like a tweet")
        res.status(200).json(new ApiResponse(200,{},"liked"))
    }
})

export const GetAllLikedVedios=asyncHandler(async(req,res)=>{
    const user=req.user._id
    
    const UserLikedVedios=await Like.aggregate([
        {
            $match:{
                likedby:new mongoose.Types.ObjectId(user)
            }
        },{
            $project:{
                from:"vedios",
                localefield:"vedio",
                foriegnfield:"_id",
                as:"vedio",
                pipeline:[{
                    $project:{
                        Title:1,
                        Discription:1,
                        Vediofile:1,
                        Thumbnail:1,
                    }
                }]
            }
        },
        {
            $project:{
                vedio:1
            }
        }
    ])

    if(UserLikedVedios.length<0) throw new ApiError(502,"Error while getting vedios")

        res.status(200).json(new ApiResponse(200,UserLikedVedios[0],"UserLike Vedio Fetched Successfully"))
})

