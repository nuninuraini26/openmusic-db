const autobind = require('auto-bind')
const ClientError = require('../../exceptions/client-error')
class SongsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
        autobind(this)
    }

    async postSongHandler(request,h) {
          this._validator.validateSongPayloads(request.payload)
          const { title, year, genre, performer, duration, albumId } = request.payload
          const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
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
        const parameter = request.query
        const songs = await this._service.getSongs(parameter)
        return {
          status: 'success',
          data: {
            songs: songs.map((song) => ({
				id: song.id,
				title: song.title,
				performer: song.performer
            }), ),
          },
        }
      }
    async getSongByIdHandler(request, h) {
            const {id} = request.params
            const song = await this._service.getSongById(id)
            return {
                status: 'success',
                data: {
                    song
                }
            }
        } 

    async putSongByIdHandler(request, h) {
            this._validator.validateSongPayloads(request.payload)
            const {id} = request.params
            await this._service.editSongById(id, request.payload) 
            return {
                status: 'success',
                message: 'song is successfully updated'
            }
        } 

    async deleteSongByIdHandler(request, h) {
          const {id} = request.params
          await this._service.deleteSongById(id)
          return {
              status: 'success',
              message: 'song is successfully deleted'
          }
      } 
}


module.exports = { SongsHandler }