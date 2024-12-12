import mongoose from "mongoose";
import { Tweet } from "../models/tweets.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/Asynchandler.js";

export const CreateTweet = asyncHandler(async (req, res) => {
  const {content} = req.body;
  const userId = req.user._id;
  if (!content)
    throw new ApiError(400, "Please Provide the Content for the tweet");
  console.log("Testing 123");
  console.log("Content : " + content);
  console.log("UserId : " + userId);

  const NewTweet = await Tweet.create({
    owner: userId,
    content: content,
  });
  if (!NewTweet) throw new ApiError(502, "Error while Creating a Tweet");
  console.log("New Tweet : " + NewTweet);

  res
    .status(200)
    .json(new ApiResponse(200, { NewTweet }, "Tweet Created SuccessFully "));
});

export const UpdateTweet = asyncHandler(async (req, res) => {
  const { TweetId } = req.params;
  const {content} = req.body;
  if (!content)
    throw new ApiError(400, "Please Provide the Content for the tweet");
  console.log("Content  : " + content);
  console.log("TweetId  : " + TweetId);

  const UpdatedTweet = await Tweet.findByIdAndUpdate(TweetId, {
    content: content,
  },{new:true}).select("content");
  if (!UpdatedTweet) throw new ApiError(502, "Tweet Not Updated");

  console.log("Tweet After Updation : " + UpdatedTweet);

  res.status(200).json(200, { UpdatedTweet }, "Tweet Updated Successfully ");
});

export const DeleteTweet = asyncHandler(async (req, res) => {
  const { TweetId } = req.params;
  const DeletedTweet = await Tweet.findByIdAndDelete(TweetId);
  if (!DeletedTweet)
    throw new ApiError(402, "There was a Error while Deleting Tweet");
  res.status(200).json(new ApiResponse(200, {}, "Tweet Deleted Successfully"));
});

export const GetAllTweets = asyncHandler(async (req, res) => {
  const { UserId } = req.params;

  const UserTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(UserId),
      },
    },
    {
      $project: {
        content: 1,
      },
    },
  ]);

  if (!UserTweets.length < 0)
    
  throw new ApiError(502, "Error while Fetching User Tweets");
  console.log("User Tweets : " + UserTweets.length);
  return res.status(200).json(new ApiResponse(200,{UserTweets},"Tweets Fetched Successfully"))
});
