require('dotenv').config()
const hapi = require('@hapi/hapi')
const albums = require('./api/albums')
const songs = require('./api/songs')
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')
const { AlbumsServices } = require('./services/postgres/albumsServices')
const { SongsServices } = require('./services/postgres/songsServices')
const ClientError = require('./exceptions/client-error')

const init = async () => {
    const albumsServices = new AlbumsServices()
		const songsServices = new SongsServices()
    const server = hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    })

    await server.register([
			{
        plugin: albums,
        options: {
            service: albumsServices,
            validator: AlbumsValidator
        },
			},
			{
				plugin: songs,
				options: {
					  service: songsServices,
						validator: SongsValidator
				}
			}])
            server.ext('onPreResponse', (request, h) => {
                const { response } = request
                if (response instanceof Error) {
             
                  if (response instanceof ClientError) {
                    const newResponse = h.response({
                      status: 'fail',
                      message: response.message,
                    })
                    newResponse.code(response.statusCode)
                    return newResponse
                  }
                  if (!response.isServer) {
                    return h.continue
                  }
                  const newResponse = h.response({
                    status: 'error',
                    message: 'terjadi kegagalan pada server kami',
                  })
                  newResponse.code(500)
                  return newResponse
                }
                return h.continue
              })
    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()