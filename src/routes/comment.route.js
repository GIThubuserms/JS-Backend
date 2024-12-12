import {Router } from "express";
import { verifyuser } from "../middlewares/Auth.middleware.js";
import { AddComment, DeleteComment, GetVedioComment, UpdateComment } from "../controllers/comment.controller.js";


export const CommentRouter=new Router()
CommentRouter.use(verifyuser)

CommentRouter.route('/AddComment/:VedioId').post(AddComment)
CommentRouter.route('/UpdateComment/:CommentID').patch(UpdateComment)
CommentRouter.route('/DeleteComment/:CommentID').delete(DeleteComment)
CommentRouter.route('/GetAllVedioComments/:VedioId').post(GetVedioComment)
