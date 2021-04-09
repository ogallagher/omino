/*

Owen Gallagher <ogallagher>
2021-04-08

Omino webserver tests.

*/

// frontend imports
const Logger = require('./public/js/logger.js').Logger

// module logger
log = new Logger('tests', Logger.LEVEL_DEBUG)

function read_dotenv(keys) {
	let passed = false
	
	try {
		if (keys) {
			// true until proven false
			passed = true
			
			for (let key of keys) {
				if (key in process.env) {
					log.debug(`${key} = ${process.env[key]}`)
				}
				else {
					log.error(`key ${key} not found in .env`)
					passed = false
				}
			}
		}
		else {
			log.warning('no .env test keys provided; assuming pass')
			passed = true
		}
	}
	catch (err) {
		log.error('failed to test .env read')
		passed = false
	}
	
	return passed
}

if (typeof exports != 'undefined') {
	exports.read_dotenv = read_dotenv
}
else {
	log.error('backend tests not written for frontend use')
}