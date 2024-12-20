import { Router } from "express";
import { GetAllLikedVedios, ToggleCommentLike,ToggleVedioLike ,ToogleTweetLike } from "../controllers/like.controller.js";
import { verifyuser } from "../middlewares/Auth.middleware.js";


export const Likerouter=new Router()

Likerouter.use(verifyuser)

Likerouter.route('/toogle/v/:vedioId').post(ToggleVedioLike)
Likerouter.route('/toogle/c/:commentId').post(ToggleCommentLike)
Likerouter.route('/toogle/t/:tweetId').post(ToogleTweetLike)
Likerouter.route('/vedios').get(GetAllLikedVedios)