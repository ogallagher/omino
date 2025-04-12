/**
 * @fileoverview Omino webserver tests.
 */

// frontend imports

/**
 * 
 */
const Logger = require('../public/js/logger.js').Logger

// backend imports
const dotenv = require('dotenv')
const assert = require('assert')
const path = require('path')

/**
 * Module logger.
 */
const log = new Logger('tests.server', Logger.LEVEL_DEBUG)

/**
 * 
 * @param {string[]} keys
 */
function read_dotenv(keys) {
	let passed = false
	/**
	 * @type {string[]}
	 */
	let values = []
	
	try {
		if (keys) {
			// true until proven false
			passed = true
			
			for (let key of keys) {
				if (key in process.env) {
					let value = process.env[key]
					values.push(value)
					log.debug(`${key} = ${value}`)
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
	
	return { passed, values }
}

describe('dotenv', () => {
	before(() => {
		dotenv.config({
			path: path.join(__dirname, 'tests.env'),
			debug: true
		})
		log.debug(JSON.stringify(process.env, undefined, 2), 'before')
	})

	it('finds defined keys', () => {
		let {passed, values} = read_dotenv(['key1', 'key2'])
		assert.ok(passed)
		assert.deepStrictEqual(values, ['one', 'two'])
	})
})

if (typeof exports != 'undefined') {
	exports.read_dotenv = read_dotenv
}
else {
	log.error('backend tests not written for frontend use')
}