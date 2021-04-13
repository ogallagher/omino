/*

Owen Gallagher <github.com/ogallagher>
2021-04-11

*/

// constants

const COMP_PREFIX = 'frontend-import'

let frontend_imports_log = new Logger('frontend_imports', Logger.LEVEL_DEBUG)

// methods

function frontend_import(component_name, selector_prefix) {
	let log = frontend_imports_log
	log.debug(`importing component ${component_name}`)
	
	if (selector_prefix === undefined) {
		selector_prefix = '.'
	}
	
	return new Promise(function(resolve, reject) {
		let container = $(`${selector_prefix}${COMP_PREFIX}-${component_name}`)
		
		if (container.length) {
			container.load(`/components/${component_name}.html`,resolve)
		}
		else {
			reject(component_name)
		}
	})
}

function frontend_import_nowhere(component_name) {
	let log = frontend_imports_log
	log.debug(`importing component ${component_name}`)
	
	return new Promise(function(resolve,reject) {
		$.ajax({
			method: 'GET',
			url: `/components/${component_name}.html`,
			success: resolve,
			error: reject
		})
	})
}
