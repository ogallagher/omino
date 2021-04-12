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
const parse_db_scratch_string = require('./public/js/string_manip.js').str_to_raw_lang_ts

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

function get_letter_type(letter, db_scratch) {
	if (db_scratch['vowels'].includes(letter)) {
		return 'vowel'
	}
	else if (db_scratch['voiced consonants'].includes(letter)) {
		return 'consonant-voice'
	}
	else if (db_scratch['breathed consonants'].includes(letter)) {
		return 'consonant-breath'
	}
	else {
		log.error(`unknown letter type for ${letter}`)
		return null
	}
}

function get_root_type(root, db_scratch) {
	if (db_scratch['simple roots'].includes(root)) {
		return 'simple'
	}
	else if (db_scratch['2vow roots'].includes(root)) {
		return '2vow'
	}
	else if (db_scratch['2con roots'].includes(root)) {
		return '2con'
	}
	else if (db_scratch['2con2vow roots'].includes(root)) {
		return '2con2vow'
	}
	else {
		log.error(`unknown root type for ${root}`)
		return null
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
		
		for (let entry in db_scratch['rel definitions']) {
			let definitions = db_scratch['rel definitions'][entry]
			
			log.debug(`importing ${entry} with ${definitions.length} definitions`)
			
			// insert entry into strings
			let entry_str = parse_db_scratch_string(entry, LANG_OMINO)
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
				let def_str = parse_db_scratch_string(definition, LANG_ENGLISH)
				
				// insert definition into strings and definitions
				promises.push(
					db_server.get_query('insert_definition', def_str, false)
					.then(function(action) {
						return new Promise(function(resolve) {
							if (action.sql) {
								db_server.send_query(action.sql)
								.then(function() {
									log.info(`added def ${entry_str.value}`)
								})
								.catch(function(err) {
					  				log.error(`error in def insert: ${err} for ${entry_str.value}`)
									fails++
								})
								.finally(function() {
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
									.then(function(action) {
										if (action.sql) {
											return db_server.send_query(action.sql)
											.then(function(data) {
												log.info(`[${entry_str.value}:${def_str.value}] --> ${JSON.stringify(data)}`)
											})
											.catch(function(err) {
												log.error(`error in rel def insert ${err} for ${entry_str.value}=${def_str.value}`)
												fails++
											})
										}
										else {
											log.error(`failed to compile sql for rel def ${def_str.value}`)
											fails++
										}
									})
									.catch(function(err) {
										log.error(`conversion from endpoint to sql failed: ${err}`)
										fails++
									})
									.finally(resolve)
								})
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
					entry_str.letter_type = get_letter_type(entry_str.value, db_scratch)
					
					promises.push(
						db_server.get_query('insert_letter',entry_str,false)
						.then(function(action) {
							return new Promise(function(resolve) {
								if (action.sql) {
									db_server.send_query(action.sql)
									.then(function(data) {
										log.info(`added letter ${entry_str.value} --> ${JSON.stringify(data)}`)
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
					entry_str.root_type = get_root_type(entry_str.value, db_scratch)
					
					promises.push(
						db_server.get_query('insert_root',entry_str,false)
						.then(function(action) {
							return new Promise(function(resolve) {
								if (action.sql) {
									db_server.send_query(action.sql)
									.then(function(data) {
										log.info(`added root ${entry_str.value} --> ${JSON.stringify(data)}`)
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
				if (entry_str.value.search(/\s/) == -1) {
					promises.push(
						db_server.get_query('insert_omino_word',entry_str,false)
						.then(function(action) {
							return new Promise(function(resolve) {
								if (action.sql) {
									db_server.send_query(action.sql)
									.then(function(data) {
										log.info(`added omi word ${entry_str.value} --> ${JSON.stringify(data)}`)
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
		
		for (let entry in db_scratch['rel examples']) {
			let examples = db_scratch['rel examples'][entry]
			log.debug(`importing ${entry} with ${examples.length} examples`)
			
			let entry_str = parse_db_scratch_string(entry, LANG_OMINO)
			// assuming example entry already in strings
			
			for (let example of examples) {
				// insert example into strings
				let ex_str = parse_db_scratch_string(example, LANG_OMINO)
				ex_str.correct = true
				
				// insert example into strings and examples
				promises.push(
					db_server.get_query('insert_example', ex_str, false)
					.then(function(action) {
						return new Promise(function(resolve) {
							if (action.sql) {
								db_server.send_query(action.sql)
								.then(function() {
									log.info(`added ex ${entry_str.value}`)
								})
								.catch(function(err) {
					  				log.error(`error in ex insert: ${err} for ${entry_str.value}`)
									fails++
								})
								.finally(function() {
									// insert entry-example into rel examples
									db_server.get_query(
										'insert_rel_example', 
										{
											entry_val: entry_str.value,
											entry_lang: entry_str.language,
											ex_val: ex_str.value,
											ex_lang: ex_str.language
										},
										false
									)
									.then(function(action) {
										if (action.sql) {
											return db_server.send_query(action.sql)
											.then(function(data) {
												log.info(`[${entry_str.value}:${ex_str.value}] --> ${JSON.stringify(data)}`)
											})
											.catch(function(err) {
												log.error(`error in rel ex insert ${err} for ${entry_str.value}=${ex_str.value}`)
												fails++
											})
										}
										else {
											log.error(`failed to compile sql for rel ex ${ex_str.value}`)
											fails++
										}
									})
									.catch(function(err) {
										log.error(`conversion from endpoint to sql failed: ${err}`)
										fails++
									})
									.finally(resolve)
								})
							}
							else {
								log.error(`failed to compile sql for ex insert ${ex_str.value}`)
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
		
		for (let entry in db_scratch['homophones']) {
			// insert one and two into strings
			let one = parse_db_scratch_string(entry, LANG_OMINO)
			let two = parse_db_scratch_string(db_scratch['homophones'][entry], LANG_OMINO)
			
			let hstr_promises = [
				db_server.get_query('insert_string',one,false)
				.then(function(action) {
					if (action.sql) {
						return db_server.send_query(action.sql)
						.then(function() {
							log.info(`inserted homophone string ${one.value}`)
						})
						.catch(function(err) {
							log.error(`error in homophone string insert: ${err}`)
						})
					}
					else {
						log.error(`failed to compile sql from homophone str insert of ${one.value}`)
					}
				})
				.catch(function(err) {
					log.error(`conversion from endpoint to sql failed: ${err}`)
				}),
				db_server.get_query('insert_string',two,false)
				.then(function(action) {
					if (action.sql) {
						return db_server.send_query(action.sql)
						.then(function() {
							log.info(`inserted homophone string ${two.value}`)
						})
						.catch(function(err) {
							log.error(`error in homophone string insert: ${err}`)
						})
					}
					else {
						log.error(`failed to compile sql from homophone str insert of ${two.value}`)
					}
				})
				.catch(function(err) {
					log.error(`conversion from endpoint to sql failed: ${err}`)
				})
			]
			
			promises.push(
				Promise.all(hstr_promises)
				.then(function() {
					// insert one ~ two into homophones
					db_server.get_query(
						'insert_homophones', 
						{
							one_val: one.value,
							one_lang: one.language,
							two_val: two.value,
							two_lang: two.language
						},
						false
					)
					.then(function(action) {
						return new Promise(function(resolve) {
							if (action.sql) {
								db_server.send_query(action.sql)
								.then(function(data) {
									log.info(`homophones ${one.value}~${two.value} -> ${JSON.stringify(data)}`)
								})
								.catch(function(err) {
					  				log.error(`error in homophones insert: ${err} for ${one.value}~${two.value}`)
									fails++
								})
								.finally(resolve)
							}
							else {
								log.error(`failed to compile sql for ex insert ${ex_str.value}`)
								fails++
								resolve()
							}
						})
					})
					.catch(function(err) {
						log.error(`conversion from endpoint to sql failed: ${err}`)
					})
				})
			)
		}
		
		Promise.all(promises)
		.then(function() {
			log.info(`scratch database import finished with ${fails} fails`)
			
			if (fails == 0) {
				resolve()
			}
			else {
				reject(fails)
			}
		})
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
	
	if (cli_args[CLI_IMPORT_DB_SCRATCH]) {
		log.debug('importing from db scratch')
		
		import_database_scratch()
		.then(() => {
			log.info('db scratch import succeeded')
		})
		.catch(() => {
			log.error('db scratch import finished with errors')
		})
	}
})
