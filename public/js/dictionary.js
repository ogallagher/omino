/*

Owen Gallagher <github.com/ogallagher>
2021-04-11

*/

// imports

// consts

const frontend_components = [
	'translator'
]

// vars

let dictionary_log = new Logger('dictionary',Logger.LEVEL_DEBUG)

let loaded_components = []

// methods

// main

$(document).ready(function() {
	let log = dictionary_log
	
	log.debug('dictionary document ready')
	
	// components
	for (let component of frontend_components) {
		frontend_import(component)
		.then(function() {
			log.info(`imported component ${component}`)
			loaded_components.push(component)
		})
		.catch(function() {
			log.error(`failed to import ${component}`)
		})
	}
})
