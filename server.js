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
	const DOTENV_LOG_LEVEL = 'LOGGING'
	const DOTENV_WEBSERVER = 'WEBSERVER'
	
	// cli args
	const CLI_LOG_LEVEL = 'logging'
	const CLI_WEBSERVER = 'yes'
	
	// cross origin request origins
	const origins = [
		'http://localhost',	'http://127.0.0.1',		// local testing (same device)
		'http://omino.conlang.org'					// omino conlang subdomain
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
		log.info(`db: ${endpoint} [${JSON.stringify(args)}]`)
		
		db_server
		.get_query(endpoint, args, true)
		.then(function(action) {
		    if (action.sql) {
		  		db_server.send_query(action.sql)
				.then(function(data) {
					res.json(data)
				})
				.catch(function(err) {
	  				log.error(`error in db data fetch: ${err}`)
	  				res.json({error: 'fetch error'})
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
		// get environment vars
		if (require('dotenv').config().error) {
			throw 'environment variables not loaded from .env'
		}
		else {
			log.info('environment variables loaded from .env')
		}
		
		if (cli_args.hasOwnProperty(CLI_LOG_LEVEL) || process.env.hasOwnProperty(DOTENV_LOG_LEVEL)) {
			let level_name = cli_args[CLI_LOG_LEVEL] || process.env[DOTENV_LOG_LEVEL]
			let level = Logger.level_number(level_name)
			log.info(`set logging level to ${level_name}=${level}`)
			log.set_level(level)
		}
		
		if (cli_args.hasOwnProperty(CLI_WEBSERVER) || process.env.hasOwnProperty(DOTENV_WEBSERVER)) {
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
			
			// route root path to about page
			server.get('/', function(req,res,next) {
				log.debug(`routing root path to /about.html`)
				res.sendFile(`${PUBLIC_DIR}/about.html`, {
					root: '.'
				})
			})
		
			// http server
			server.listen(server.get('port'), on_start)
			
			// init db server
			db_server.init()
			
			//expose database
			server
			.route(ROUTE_DB)
			.get(function (req,res) {
				handle_db(
					req.query.endpoint,	// db api endpoint
					req.query, 			// other arguments
					res
				)
			})
			.post(function (req,res) {
				handle_db(
					req.body.endpoint,	// db api endpoint
					req.body,			// other arguments
					res
				)
			});
			
			// route raw filenames to extension filenames (db endpoint skipped if already handled)
			server.get(/\/(.+)(\.html){0}/, function(req,res,next) {
				let filename = req.params[0]
				let extended = `${PUBLIC_DIR}/${filename}.html`
				
				log.debug(`routing raw file ${filename} to ${extended}`)
				res.sendFile(extended, {
					root: '.'
				})
			})
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