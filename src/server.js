require('dotenv').config()
const hapi = require('@hapi/hapi')

const init = async () => {
	const server = hapi.server({
		port: process.env.PORT,
		host: process.env.HOST
	})
  
	await server.start()
	console.log(`Server runs on ${server.info.uri}`)
}

init()