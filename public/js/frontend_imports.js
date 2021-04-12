/*

Owen Gallagher <github.com/ogallagher>
2021-04-11

*/

/*
valid component ids:

- translator
*/

// constants

const COMP_PREFIX = `frontend-import`

let frontend_imports_log = new Logger('frontend_imports', Logger.LEVEL_DEBUG)

// methods

function frontend_import(component_name) {
	frontend_imports_log.debug(`importing component ${component_name}`)
	
	return new Promise(function(resolve, reject) {
		let selector = `#${COMP_PREFIX}-${component_name}`
		let container = $(selector)
		
		if (container.length) {
			container.load(`/components/${component_name}.html`,resolve)
		}
		else {
			reject(selector)
		}
	})
}
