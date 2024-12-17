import { Router } from "express";
import { GetAllLikedVedios, ToggleCommentLike,ToggleVedioLike ,ToogleTweetLike } from "../controllers/like.controller.js";


export const Likerouter=new Router()

Likerouter.route('/toogle/v/:vedioId').post(ToggleVedioLike)
Likerouter.route('/toogle/c/:commentId').post(ToggleCommentLike)
Likerouter.route('/toogle/t/tweetId').post(ToogleTweetLike)
Likerouter.route('/vedios').get(GetAllLikedVedios)