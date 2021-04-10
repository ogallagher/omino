/*

Owen Gallagher <github.com/ogallagher>
2021-04-08

Omino webserver initialization.

*/

// external imports

const fs = require('fs')
const ShowdownConverter = require('showdown').Converter
const yargs = require('yargs')

// frontend imports

const Logger = require('./public/js/logger.js').Logger

// constants

const MD_README_FILE = 'readme.md'
const MD_DICTIONARY_FILE = 'dictionary.md'

const PUBLIC_DIR = 'public'
const TEMPLATES_DIR = 'templates'
const DATA_DIR = 'data'
const DOCS_DIR = 'docs'

const ABOUT_FILE = `${PUBLIC_DIR}/about.html`
const ABOUT_TEMPLATE_FILE = `${TEMPLATES_DIR}/about.html`
const DICTIONARY_FILE = `${PUBLIC_DIR}/dictionary.html`
const DICTIONARY_TEMPLATE_FILE = `${TEMPLATES_DIR}/dictionary.html`

const COMPONENTS_DIR = `${PUBLIC_DIR}/components`
const MD_STYLE_FILE = `${COMPONENTS_DIR}/md_style.html`
const MD_SCRIPT_FILE = `${COMPONENTS_DIR}/md_script.html`
const NAVBAR_FILE = `${COMPONENTS_DIR}/navbar.html`

const PLACEHOLDER_CSS = '{backend-import-css}'
const PLACEHOLDER_JS = '{backend-import-js}'
const PLACEHOLDER_MD = '{backend-import-md}'
const PLACEHOLDER_NAVBAR = '{backend-import-navbar}'

const ISO_LANGS_FILE = `${DATA_DIR}/iso_language_codes.json`
const DATABASE_SCRATCH_FILE = `${DOCS_DIR}/database.json`

const CLI_LOG_LEVEL = 'logging'
const CLI_COMPILE = 'compile'
const CLI_IMPORT_ISO_LANGS = 'import-iso-langs'
const CLI_IMPORT_DB_SCRATCH = 'import-db-scratch'

const LANG_ENGLISH = 'eng'
const LANG_SPANISH = 'spa'
const LANG_KOREAN = 'kor'
const LANG_OMINO = 'omi'

// module logger
const log = new Logger('init', Logger.LEVEL_DEBUG)

// markdown-html converter
const md_html_converter = new ShowdownConverter({
	omitExtraWLInCodeBlocks: true,
	customizedHeaderId: true,
	ghCompatibleHeaderId: true,
	tables: true,
	tasklists: true,
	completeHTMLDocument: false
})

let db_server

// methods

function parse_cli_args() {
	return Promise.resolve(
		yargs
		.option(CLI_LOG_LEVEL, {
			alias: 'l',
			type: 'string',
			description: 'Set logging level to one of: debug (verbose), info, warning, error, critical (quiet).'
		})
		.option(CLI_COMPILE, {
			alias: 'c',
			type: 'string',
			description: `Compile a comma-delimited subset of available markdown files: all, ${MD_README_FILE}, ${MD_DICTIONARY_FILE}.`
		})
		.option(CLI_IMPORT_ISO_LANGS, {
			type: 'boolean',
			description: `Import language codes from ${ISO_LANGS_FILE} into the database. This should only be done once.`,
			default: false
		})
		.option(CLI_IMPORT_DB_SCRATCH, {
			type: 'boolean',
			description: `Import all scratch-db contents from ${DATABASE_SCRATCH_FILE} into the database. This should only be done once.`
		})
		.help()
		.alias('help','h')
		.argv
	)
}

function load_navbar() {
	return new Promise(function(resolve,reject) {
		// load navbar
		fs.readFile(NAVBAR_FILE, 'utf8', function(err, navbar) {
			if (err) {
				log.error(err)
				log.error(`failed to read from ${NAVBAR_FILE}`)
				reject()
			}
			else {
				log.debug('loaded navbar component')
				resolve(navbar)
			}
		})
	})
}

function load_md_template(template_file) {
	return new Promise(function(resolve,reject) {
		// load css
		fs.readFile(MD_STYLE_FILE, 'utf8', function(err, css) {
			if (err) {
				log.error(err)
				log.error(`failed to read from ${MD_STYLE_FILE}`)
				reject()
			}
			else {
				log.debug('md css loaded')
				
				//load js
				fs.readFile(MD_SCRIPT_FILE, 'utf8', function(err, js) {
					if (err) {
						log.error(err)
						log.error(`failed to read from ${MD_SCRIPT_FILE}`)
						reject()
					}
					else {
						log.debug('md js loaded')
						
						// load template
						fs.readFile(template_file, 'utf8', function(err, template) {
							if (err) {
								log.error(err)
								log.error(`failed to read from ${template_file}`)
								reject()
							}
							else {
								log.debug('md template skeleton loaded')
								
								// assemble template
								new Promise(function(resolve) {
									if (template.includes(PLACEHOLDER_NAVBAR)) {
										load_navbar()
										.then(function(navbar) {
											template = template.replace(PLACEHOLDER_NAVBAR,navbar)
											log.debug('loaded navbar into about')
										})
										.catch((err) => {
											if (err) {
												log.error(err)
											}
										})
										.finally(resolve)
									}
									else {
										log.error(`navbar missing from ${template_file}`)
										resolve()
									}
								})
								.then(() => {
									template = template
										.replace(PLACEHOLDER_CSS,css)
										.replace(PLACEHOLDER_JS,js)
								
									log.debug('md template loaded')
									resolve(template)
								})
							}
						})
					}
				})
			}
		})
	})
}

function compile_readme() {
	return new Promise(function(resolve,reject) {
		log.debug(`compiling ${MD_README_FILE} to html at ${ABOUT_FILE}`)
		
		fs.readFile(MD_README_FILE, 'utf8', function(err, markdown) {
			if (err) {
				log.error(err)
				log.error(`failed to read ${MD_README_FILE}`)
				reject()
			}
			else {
				try {
					html = md_html_converter.makeHtml(markdown)
					log.info(`converted readme to html. html length = ${html.length}`)
					
					load_md_template(ABOUT_TEMPLATE_FILE)
					.then(function(template) {
						// insert html into template
						html = template.replace(PLACEHOLDER_MD,html)
						
						// export to file
						fs.writeFile(ABOUT_FILE, html, function(err) {
							if (err) {
								log.error(err)
								log.error(`failed to write to ${ABOUT_FILE}`)
								reject()
							}
							else {
								log.info(`wrote compiled readme to ${ABOUT_FILE}`)
								resolve()
							}
						})
					})
					.catch(reject)
				}
				catch (err) {
					log.error(err)
					log.error(`html compilation failed. source markdown:\n${markdown}`)
					reject()
				}
			}
		})
	})
}

function compile_dictionary() {
	return new Promise(function(resolve,reject) {
		log.debug(`compiling ${MD_DICTIONARY_FILE} to html at ${DICTIONARY_FILE}`)
		
		fs.readFile(MD_DICTIONARY_FILE, 'utf8', function(err, markdown) {
			if (err) {
				log.error(err)
				log.error(`failed to read ${MD_DICTIONARY_FILE}`)
				reject()
			}
			else {
				try {
					html = md_html_converter.makeHtml(markdown)
					log.info(`converted dictionary to html. html length = ${html.length}`)
					
					load_md_template(DICTIONARY_TEMPLATE_FILE)
					.then(function(template) {
						// insert html into template
						html = template.replace(PLACEHOLDER_MD,html)
						
						// export to file
						fs.writeFile(DICTIONARY_FILE, html, function(err) {
							if (err) {
								log.error(err)
								log.error(`failed to write to ${DICTIONARY_FILE}`)
								reject()
							}
							else {
								log.info(`wrote compiled dictionary to ${DICTIONARY_FILE}`)
								resolve()
							}
						})
					})
				}
				catch (err) {
					log.error(err)
					log.error(`html compilation failed. source markdown:\n${markdown}`)
					reject()
				}
			}
		})
	})
}

function init_db_server() {
	// connect to database
	if (db_server == undefined) {
		db_server = require('./db/db_server.js')
		db_server.init()
	}
}

function import_iso_langs() {
	return new Promise(function(resolve,reject) {
		init_db_server()
		
		let langs = require(`./${ISO_LANGS_FILE}`)
		log.debug(`loaded ${langs.length} language codes from ${ISO_LANGS_FILE}`)
	
		// ex. { English: 'Afar', alpha2: 'aa', 'alpha3-b': 'aar' }
		let fails = 0
		let promises = []
		for (let lang of langs) {
			let code = lang['alpha3-b']
			let en_name = lang['English']
		
			log.debug(`adding language ${en_name}=${code}`)
			
			promises.push(
				db_server
				.get_query('insert_language', {code: code, name: en_name}, false)
				.then(function(action) {
					return new Promise(function(resolve) {
					    if (action.sql) {
					  		db_server.send_query(action.sql)
							.then(function() {
					  			log.info(`added language ${en_name}=${code}`)
					  		})
							.catch(function(err) {
				  				log.error(`error in db data insert: ${err}`)
								fails++
							})
							.finally(resolve)
					    }
						else {
							log.error(`failed to compile sql query for ${code} language insert`)
							fails++
							resolve()
						}
					})
				})
				.catch(function(err) {
					log.error('conversion from endpoint to sql failed: ' + err)
				})
			)
		}
		
		Promise.all(promises).finally(() => {
			log.info(`language imports complete with ${fails} errors and ${langs.length-fails} passes`)
			
			if (fails > 0) {
				reject()
			}
			else {
				resolve()
			}
		})
	})
}

function parse_db_scratch_string(raw, language_default) {
	// determine language and value
	let lang_code = /^\w{3}:/m
	let language = language_default
	let value = raw
	
	if (raw.search(lang_code) != -1) {
		language = raw.substring(0,4)
		value = raw.substring(4)
	}
	
	return {
		language: language,
		value: value,
		timestamp_ms: Math.floor(new Date())
	}
}

function import_database_scratch() {
	return new Promise(function(resolve,reject) {
		init_db_server()
		
		let db_scratch = require(`./${DATABASE_SCRATCH_FILE}`)
		log.debug(`loaded scratch database from ${DATABASE_SCRATCH_FILE}`)
		
		let promises = []
		let fails = 0
		
		// import definitions
		
		for (let entry in rel_definitions) {
			let definitions = rel_definitions[entry]
			
			log.debug(`importing ${entry} with ${definitions.length} definitions`)
			
			// insert entry into strings
			let entry_str = parse_db_scratch_string(entry, LANG_OMI)
			promises.push(
				db_server
				.get_query('insert_string', entry_str, false)
				.then(function(action) {
					return new Promise(function(resolve) {
					    if (action.sql) {
					  		db_server.send_query(action.sql)
							.then(function() {
					  			log.info(`added str ${entry_str.value}`)
					  		})
							.catch(function(err) {
				  				log.error(`error in str insert: ${err} for ${entry_str.value}`)
								fails++
							})
							.finally(resolve)
					    }
						else {
							log.error(`failed to compile sql for str insert ${entry_str.value}`)
							fails++
							resolve()
						}
					})
				})
				.catch(function(err) {
					log.error(`conversion from endpoint to sql failed: ${err}`)
					fails++
				})
			)
			
			for (let definition of definitions) {
				// insert definition into strings
				let def_str = parse_db_scratch_string(definition, LANG_ENG)
				
				// insert definition into strings and definitions
				promises.push(
					db_server.get_query('insert_definition', def_str, false)
					.then(function(action) {
						return new Promise(function(resolve) {
							if (action.sql) {
								db_server.send_query(action.sql)
								.then(function() {
									log.info(`added def ${entry_str.value}`)
									
									// insert entry-definition into rel definitions
									return db_server.get_query(
										'insert_rel_definition', 
										{
											entry_val: entry_str.value,
											entry_lang: entry_str.language,
											def_val: def_str.value,
											def_lang: def_str.language
										},
										false
									)
									.then(function(data) {
										log.info(`[${entry_str.value}:${def_str.value}] --> ${data}`)
									})
									.catch(function(err) {
										log.error(`error in rel def insert ${err} for ${entry_str.value}=${def_str.value}`)
										fails++
									})
								})
								.catch(function(err) {
					  				log.error(`error in def insert: ${err} for ${entry_str.value}`)
									fails++
								})
								.finally(resolve)
							}
							else {
								log.error(`failed to compile sql for def insert ${def_str.value}`)
								fails++
								resolve()
							}
						})
					})
					.catch(function(err) {
						log.error(`conversion from endpoint to sql failed: ${err}`)
					})
				)
			}
			
			if (entry_str.language == LANG_OMINO) {
				// insert omino letters
				if (entry_str.value.length == 1) {
					promises.push(
						db_server.get_query('insert_letter',entry_str,false)
						.then(function(action) {
							return new Promise(function(resolve) {
								if (action.sql) {
									db_server.send_query(action.sql)
									.then(function(data) {
										log.info(`added letter ${entry_str.value} --> ${data}`)
									})
									.catch(function(err) {
										log.error(`error in letter insert ${err} for ${entry_str.value}`)
									})
									.finally(resolve)
								}
								else {
									log.error(`failed to compile sql for letter ${entry_str.value}`)
									fails++
									resolve()
								}
							})
						})
						.catch(function(err) {
							log.error(`conversion from endpoint to sql failed: ${err}`)
						})
					)
				}
			
				// insert omino roots
				if (db_scratch.roots.includes(entry)) {
					promises.push(
						db_server.get_query('insert_root',entry_str,false)
						.then(function(action) {
							return new Promise(function(resolve) {
								if (action.sql) {
									db_server.send_query(action.sql)
									.then(function(data) {
										log.info(`added root ${entry_str.value} --> ${data}`)
									})
									.catch(function(err) {
										log.error(`error in root insert ${err} for ${entry_str.value}`)
									})
									.finally(resolve)
								}
								else {
									log.error(`failed to compile sql for root ${entry_str.value}`)
									fails++
									resolve()
								}
							})
						})
						.catch(function(err) {
							log.error(`conversion from endpoint to sql failed: ${err}`)
						})
					)
				}
				
				// insert omino words
				if (!entry_str.value.includes(/\s/)) {
					promises.push(
						db_server.get_query('insert_omino_word',entry_str,false)
						.then(function(action) {
							return new Promise(function(resolve) {
								if (action.sql) {
									db_server.send_query(action.sql)
									.then(function(data) {
										log.info(`added omi word ${entry_str.value} --> ${data}`)
									})
									.catch(function(err) {
										log.error(`error in omi word insert ${err} for ${entry_str.value}`)
									})
									.finally(resolve)
								}
								else {
									log.error(`failed to compile sql for omi word ${entry_str.value}`)
									fails++
									resolve()
								}
							})
						})
						.catch(function(err) {
							log.error(`conversion from endpoint to sql failed: ${err}`)
						})
					)
				}
			}
		}
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
	log.debug('logging initialized')
	
	// get environment vars
	if (require('dotenv').config().error) {
		log.warning('environment variables not loaded from .env')
	}
	else {
		log.info('environment variables loaded from .env')
	}
	
	if (cli_args[CLI_COMPILE]) {
		let targets = cli_args[CLI_COMPILE].split(',')
		
		log.debug(`compiling: ${JSON.stringify(targets)}`)
		
		new Promise(function(resolve) {
			if (targets.includes(MD_README_FILE)) {
				compile_readme()
				.then(() => {
					log.info('compilation of readme passed')
				})
				.catch(() => {
					log.critical('compilation of readme failed')
				})
				.finally(resolve)
			}
			else {
				resolve()
			}
		})
		.then(() => {
			return new Promise(function(resolve) {
				if (targets.includes(MD_DICTIONARY_FILE)) {
					compile_dictionary()
					.then(() => {
						log.info('compilation of dictionary passed')
					})
					.catch(() => {
						log.critical('compilation of dictionary failed')
					})
					.finally(resolve)
				}
				else {
					resolve()
				}
			})
		})
	}
	
	if (cli_args[CLI_IMPORT_ISO_LANGS]) {
		log.debug('importing iso language codes')
		
		import_iso_langs()
		.then(() => {
			log.info('iso langs import complete')
		})
		.catch(() => {
			log.error('failed to import iso language codes')
		})
	}
})
