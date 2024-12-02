import { Router } from "express";
import { verifyuser } from "../middlewares/Auth.middleware";
import { AddVedioToPlaylist, createPlaylist, deletePlaylist, DeleteVedioFromPlaylist, getAllPlaylistById, getPlaylistById, updatePlaylist } from "../controllers/playlist.controller";


export const Playlistrouter=Router()

Playlistrouter.use(verifyuser)

Playlistrouter.route('/createPlaylist').post(createPlaylist)

Playlistrouter.route('/:id')
.delete(deletePlaylist)
.get(getPlaylistById)
.patch(updatePlaylist)

Playlistrouter.router('/Add/:vedioId/:PlaylistId').patch(AddVedioToPlaylist)

Playlistrouter.router('/Remove/:vedioId/:PlaylistId').patch(DeleteVedioFromPlaylist)

Playlistrouter.router('/users/:userId').get(getAllPlaylistById)