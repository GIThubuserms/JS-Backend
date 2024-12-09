import { Router } from "express";
import { verifyuser } from "../middlewares/Auth.middleware.js";
import {ToggleSubscription,TotalSubscribers,SubscribedTo} from "../controllers/subscription.controller.js"

export const subscriptionRouter=Router()

subscriptionRouter.route('/Togglesubscribe').post(verifyuser,ToggleSubscription)
subscriptionRouter.route('/TotalSubscriber').post(TotalSubscribers)
subscriptionRouter.route('/SubscribedTo').post(SubscribedTo)