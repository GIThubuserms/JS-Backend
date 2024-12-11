import { Router } from "express";
import { verifyuser } from "../middlewares/Auth.middleware.js";
import {ToggleSubscription,TotalSubscribers,SubscribedTo} from "../controllers/subscription.controller.js"

export const subscriptionRouter=Router()

subscriptionRouter.route('/Togglesubscribe/:ChannelName').post(verifyuser,ToggleSubscription)
subscriptionRouter.route('/TotalSubscriber/:ChannelName').post(TotalSubscribers)
subscriptionRouter.route('/SubscribedTo/:ChannelName').post(SubscribedTo)