/*

Owen Gallagher
2021-04-09

Exposes a connected mysql server to omino clients via http.

Note paths are accessed from server.js = from root dir.

*/

// external imports

const mysql = require('mysql')

// consts

const DOTENV_DB_URL = 'DATABASE_URL'
const ROOT_DIR = '..'
const PUBLIC_DIR = `${ROOT_DIR}/public`
const DB_DIR = `${ROOT_DIR}/db`
const DB_API_FILE = `${DB_DIR}/db_api.json`

// frontend imports

const Logger = require(`${PUBLIC_DIR}/js/logger.js`).Logger

// module logger
const log = new Logger('db_server')

let db // database connection object
let api // database api, for hiding actual sql from the client

exports.init = function() {
	// get database connection credentials
	let config = null
	
	if (process.env[DOTENV_DB_URL]) {
		config = {
			url: process.env[DOTENV_DB_URL], // url = mysql://user:password@host:3306/db
			user: null,
			pass: null,
			host: null,
			db: null,
			name: 'omino'
		} 
		
		let fields = config.url.split(/:|@/) // array = mysql //user password host 3306/db
		config.user = fields[1].substring(2)
		config.pass = fields[2]
		config.host = fields[3]
		config.db = fields[4].split('/')[1]	
	}
	else {
		log.error('database credentials environment variables not found')
	}
	
	// connect to database
	if (config != null) {
		log.debug('connecting to ' + config.name)
		
		// create connections pool
		db = mysql.createPool({
			host: config.host,
			user: config.user,
			password: config.pass,
			database: config.db,
			waitForConnections: true
		})
		
		// test a connection
		try {
			db.getConnection(function(err, connection) {
				if (err) {
					log.error(err)
					log.error('failed to connect to ' + config.host)
				}
				else {
					log.info('database connected successfully')
					connection.release()
				}
			})
		}
		catch (err) {
			log.error(err)
			log.error('failed to connect to ' + config.host)
		}
	}
	
	try {
		api = require(`./${DB_API_FILE}`)
	}
	catch (err) {
		log.critical('read from db api file failed: ' + err)
	}
}

function db_escape(arg) {
	return new Promise(function(resolve,reject) {
		// http request converts null args to empty strings; convert back
		if (arg == '') {
			arg = null
		}
		
		let escaped = mysql.escape(arg)
		
		// double check against JS injection (XSS)
		let matches = escaped.match(/[<>]/)
		if (matches) {
			log.warning(`suspicious: blocked possible xss attempt with db query arg: \n${matches}`)
			reject('xss')
		}
		else {
			// arg appears safe; approved for query
			resolve(escaped)
		}
	})
}

exports.get_query = function(endpoint, args, is_external) {
	return new Promise(function(resolve,reject) {
		let entry = api[endpoint]
		
		if (entry) {
			if (!is_external || entry.external) {
				// allow query if it's internal, or if external queries are allowed for this endpoint
				let params = entry.params // array of parameters to be replaced in query
				let query = entry.query // sql query to be assembled
				
				let approved = true
				let p = Promise.resolve()
				
				// handle general endpoints by inserting escaped params into the query directly
				for (let param of params) {
					p = p
					.then(() => {
						let a = args[param]
						
						if (a === undefined || a === null) {
							return null
						}
						else {
							return db_escape(args[param])
						}
					})
					.then(function(arg) {
						log.debug(`args[${param}] = ${args[param]} --> ${arg}`)
						query = query.replace(new RegExp(`{${param}}`,'g'), arg)
					})
				}
				
				p.then(function() {
					log.debug(endpoint + ' --> ' + query)
					resolve({sql: query})
				})
				.catch(function(err) {
					reject(err)
				})
			}
			else {
				log.warning('suspicious: blocked external attempt to access endpoint ' + endpoint)
				reject('no query for endpoint')
			}
		}
		else {
			reject('no query for endpoint')
		}
	})
}

/**
 * Execute database query and return result list.
 * 
 * @param {string} sql 
 * @returns {Promise<object[]>}
 */
exports.send_query = function(sql) {
	return new Promise(function(resolve,reject) {
		log.debug(`sending query of length ${sql.length}`)
		
		db.getConnection(function(err, conn) {
			if (err) {
				// connection failed
				log.warning('failed to connect to omino db')
				reject(err)
			}
			else {
				conn.query(sql, function(err,res) {
					// release connection when no longer needed
					conn.release()
					
					// return error if defined, and response results
					if (err) {
						log.warning(`sql error: ${err}`)
						reject(err)
					}
					else {
						let metadata = res[1]
						let data = res[0]
						if (metadata == undefined || !metadata.hasOwnProperty('fieldCount')) {
							data = res
						}
						// ensure data is an array
						if (!Array.isArray(data)) {
							data = [data]
						}
						
						log.debug(`query metadata: ${JSON.stringify(metadata)}`)
						resolve(data)
					}
				})
			}
		})
	})
}
