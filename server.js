/*

Owen Gallagher <ogallagher>
2021-04-08

Omino webserver.

*/

try {
	// external imports
	
	const yargs = require('yargs')
	const express = require('express')
	const bodyparser = require('body-parser')
	const cors = require('cors')
	
	// frontend imports
	
	const Logger = require('./public/js/logger.js').Logger
	
	// backend imports
	
	const tests = require('./tests')
	const db_server = require('./db/db_server')
	
	// constants
	
	const WEBSITE_NAME = 'Omino'
	
	const DOCS_DIR = 'docs'
	const PUBLIC_DIR = 'public'
	
	const DOTENV_PORT = 'PORT'
	
	// cli args
	const CLI_LOG_LEVEL = 'logging'
	const CLI_WEBSERVER = 'yes'
	
	// cross origin request origins
	const origins = [
		'http://localhost',	'http://127.0.0.1',		// local testing (same device)
		'http://192.168.0.30',						// local testing (different devices, pi)
		'http://ominolanguage.com'					// omino domain tbd
	]
	
	// logging
	const log = new Logger('server', Logger.LEVEL_DEBUG)
	
	// routing
	const ROUTE_DB = '/db'
	
	// server instance
	const server = express()
	
	// methods
	
	function parse_cli_args() {
		return Promise.resolve(
			yargs
			.option(CLI_LOG_LEVEL, {
				alias: 'l',
				type: 'string',
				description: 'Set logging level to one of: debug (verbose), info, warning, error, critical (quiet).'
			})
			.option(CLI_WEBSERVER, {
				alias: 'y',
				type: 'boolean',
				description: 'Run the webserver.'
			})
			.help()
			.alias('help','h')
			.argv
		)
	}
	
	function on_start() {
		log.always(`${WEBSITE_NAME} server is running at <host>:${server.get('port')}`)
	}
	
	function handle_db(endpoint,args,res) {
		log.info(`db: ${endpoint} [${args}]`)
		
		db_server
		.get_query(endpoint, args, true)
		.then(function(action) {
		    if (action.sql) {
		  		db_server.send_query(action.sql, function(err,data) {
		  			if (err) {
		  				log.error(`error in db data fetch: ${err}`)
		  				res.json({error: 'fetch error'})
		  			}
		  			else {
		  				res.json(data)
		  			}
		  		})
		    }
			else {
				res.json({error: action})
			}
		})
		.catch(function(err) {
			log.error('conversion from endpoint to sql failed: ' + err)
			res.json({error: 'endpoint error'})
		})
	}
	
	// main
	
	parse_cli_args()
	.then(function(cli_args) {
		if (cli_args[CLI_LOG_LEVEL]) {
			let level = Logger.level_number(cli_args[CLI_LOG_LEVEL])
			log.info(`set logging level to ${cli_args[CLI_LOG_LEVEL]}=${level}`)
			log.set_level(level)
		}
		
		if (cli_args[CLI_WEBSERVER]) {
			// get environment vars
			if (require('dotenv').config().error) {
				throw 'environment variables not loaded from .env'
			}
			else {
				log.info('environment variables loaded from .env')
			}
			
			tests.read_dotenv(['TEST_KEY'])
	
			// handle POST request data with bodyparser
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
			
			// init db server
			db_server.init()
			
			//expose database
			server
			.route(ROUTE_DB)
			.get(function (req,res) {
				let endpoint = req.query.endpoint //db api endpoint
				let args = req.query.args //inputs for compiled sql string
			
				handle_db(endpoint,args,res)
			})
			.post(function (req,res) {
				let endpoint = req.body.endpoint //db api endpoint
				let args = req.body.args //inputs for compiled sql string
		
				handle_db(endpoint,args,res)
			});
		}
		else {
			log.info('webserver not enabled; skipping')
		}
	})
}
catch (err) {
	console.log(err)
	console.log('make sure you run the `npm install` command to get needed node modules first')
	process.exit(1)
}