/*

Owen Gallagher <ogallagher>
2021-04-08

Omino webserver.

*/

try {
	// external imports
	
	const express = require('express')
	const bodyparser = require('body-parser')
	const cors = require('cors')
	
	// frontend imports
	
	const Logger = require('./public/js/logger.js').Logger
	
	// backend imports
	
	const tests = require('./tests')
	
	// constants
	
	const WEBSITE_NAME = 'Omino'
	
	const DOCS_DIR = 'docs'
	const PUBLIC_DIR = 'public'
	
	const DOTENV_PORT = 'PORT'
	
	// cross origin request origins
	const origins = [
		'https://localhost', 						//local testing (same device)
		'http://localhost',							//local testing (same devicel; http)
		'https://192.168.0.24',						//local testing (different devices)
		'http://192.168.0.24'						//local testing (different devices; http)
	]
	
	// logging
	log = new Logger('server', Logger.LEVEL_DEBUG)
	
	// methods
	
	function on_start() {
		log.always(`${WEBSITE_NAME} server is running at <host>:${server.get('port')}`)
	}
	
	// main
	
	// get environment vars
	if (require('dotenv').config().error) {
		throw 'environment variables not loaded from .env'
	}
	else {
		log.info('environment variables loaded from .env')
	}
	
	tests.read_dotenv(['TEST_KEY'])
	
	// handle POST request data with bodyparser
	const server = express()
	server.use(bodyparser.json())
	server.use(bodyparser.urlencoded({
		extended: false,
		limit: '50mb'
	}))
	
	// enable cross-origin requests for same origin html imports
	server.use(cors({
		origin: function(origin,callback) {
			if (origin != null && origins.indexOf(origin) == -1) {
				log.error(`cross origin request failed for ${origin}`)
				return callback(new Error('CORS for origin ' + origin + ' is not allowed access.'), false)
			}
			else {
				return callback(null,true)
			}
		}
	}))
	
	// use .env port
	server.set('port', process.env[DOTENV_PORT])
	
	// serve website from public/
	server.use(express.static(PUBLIC_DIR))
	
	// http server
	server.listen(server.get('port'), on_start)
}
catch (err) {
	console.log(err)
	console.log('make sure you run the `npm install` command to get needed node modules first')
	process.exit(1)
}