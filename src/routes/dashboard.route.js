import { vediosstats,channelstats } from "../controllers/dashboard.controller.js";
import { Router } from "express";
import { verifyuser } from "../middlewares/Auth.middleware.js";

export const dashboardrouter=new Router()

dashboardrouter.use(verifyuser)
dashboardrouter.route('/channelstats').post(channelstats)
dashboardrouter.route('/vediostats').post(vediosstats)