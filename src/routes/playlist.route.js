import { Router } from "express";
import { verifyuser } from "../middlewares/Auth.middleware.js";
import { AddVedioToPlaylist, createPlaylist, deletePlaylist, DeleteVedioFromPlaylist, getAllPlaylistById, getPlaylistById, updatePlaylist } from "../controllers/playlist.controller.js";


export const Playlistrouter=Router()

Playlistrouter.use(verifyuser)

Playlistrouter.route('/createPlaylist').post(createPlaylist)

Playlistrouter.route('/deleteplaylist/:id').delete(deletePlaylist)
Playlistrouter.route('/getplaylist/:id').get(getPlaylistById)
Playlistrouter.route('/updateplaylist/:id').patch(updatePlaylist)

Playlistrouter.route('/Add/:vedioId/:PlaylistId').post(AddVedioToPlaylist)

Playlistrouter.route('/Remove/:vedioId/:PlaylistId').patch(DeleteVedioFromPlaylist)

Playlistrouter.route('/users/:userId').get(getAllPlaylistById)