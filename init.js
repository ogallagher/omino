/*

Owen Gallagher <github.com/ogallagher>
2021-04-08

Omino webserver initialization.

*/

// external imports

const fs = require('fs')
const ShowdownConverter = require('showdown').Converter

// frontend imports

const Logger = require('./public/js/logger.js').Logger

// constants

const MD_README_FILE = 'readme.md'
const MD_DICTIONARY_FILE = 'dictionary.md'

const PUBLIC_DIR = 'public'
const TEMPLATES_DIR = 'templates'

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

// module logger
const log = new Logger('init', Logger.LEVEL_DEBUG)
log.debug('logging initialized')

// markdown-html converter
const md_html_converter = new ShowdownConverter({
	omitExtraWLInCodeBlocks: true,
	customizedHeaderId: true,
	ghCompatibleHeaderId: true,
	tables: true,
	tasklists: true,
	completeHTMLDocument: false
})

// methods

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

// main

compile_readme()
.then(() => {
	log.info('compilation of readme passed')
	
	compile_dictionary()
	.then(() => {
		log.info('compilation of dictionary passed')
	})
	.catch(() => {
		log.critical('compilation of dictionary failed')
	})
})
.catch(() => {
	log.critical('compilation of readme failed')
})
