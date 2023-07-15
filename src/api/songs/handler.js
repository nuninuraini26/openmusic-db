const autobind = require('auto-bind')
class SongsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
        autobind(this)
    }

    async postSongHandler(request, h) {
        this._validator.validateSongPayloads(request.payload)
        const songId = await this._service.addSong(request.payload)
        const response = h.response({
            status: 'success',
            message: 'song is successfully added',
            data: {
                songId,
            },
        })
        response.code(201)
        return response
    }

    async getSongsHandler(request) {
        const { title, performer } = request.query
    
        const songs = await this._service.getSongs(title, performer)
    
        return {
            status: 'success',
            data: { 
                songs
            },
        }
    }
    
    async getSongByIdHandler(request) {
        const {id} = request.params
        const song = await this._service.getSongById(id)
        return {
            status: 'success',
            data: {
                song,
            },
        }
    }

    async putSongByIdHandler(request) {
        this._validator.validateSongPayloads(request.payload)
        const {id} = request.params
        await this._service.editSongById(id, request.payload)
        return {
            status: 'success',
            message: 'song is successfully updated',
        }
    }

    async deleteSongByIdHandler(request) {
        const {id} = request.params
        await this._service.deleteSongById(id)
        return {
            status: 'success',
            message: 'song is successfully deleted',
        }
    }
}


module.exports = {SongsHandler}
