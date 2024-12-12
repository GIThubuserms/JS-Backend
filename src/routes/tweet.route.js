import {Router} from 'express'
import { verifyuser } from '../middlewares/Auth.middleware.js'
import { CreateTweet, DeleteTweet, GetAllTweets, UpdateTweet } from '../controllers/tweet.controller.js'

export const Tweetrouter=new Router()

Tweetrouter.route('/CreateTweet').post(verifyuser,CreateTweet)
Tweetrouter.route('/UpdateTweet/:TweetId').patch(verifyuser,UpdateTweet)
Tweetrouter.route('/DeleteTweet/:TweetId').delete(verifyuser,DeleteTweet)
Tweetrouter.route('/AllTweets/:UserId').post(GetAllTweets)
