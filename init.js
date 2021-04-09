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

const README_FILE = 'readme.md'

const PUBLIC_DIR = 'public'
const ABOUT_FILE = `${PUBLIC_DIR}/about.html`
const ABOUT_TEMPLATE_FILE = `${PUBLIC_DIR}/about_template.html`
const COMPONENTS_DIR = `${PUBLIC_DIR}/components`
const MD_STYLE_FILE = `${COMPONENTS_DIR}/md_style.html`
const MD_SCRIPT_FILE = `${COMPONENTS_DIR}/md_script.html`

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

function load_md_template() {
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
						fs.readFile(ABOUT_TEMPLATE_FILE, 'utf8', function(err, template) {
							if (err) {
								log.error(err)
								log.error(`failed to read from ${ABOUT_TEMPLATE_FILE}`)
								reject()
							}
							else {
								log.debug('md template skeleton loaded')
								
								// assemble template
								template = template
									.replace('<div id="backend-import-css"></div>',css)
									.replace('<div id="backend-import-js"></div>',js)
								
								log.debug('md template loaded')
								resolve(template)
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
		log.debug(`compiling ${README_FILE} to html at ${ABOUT_FILE}`)
		
		fs.readFile(README_FILE, 'utf8', function(err, markdown) {
			if (err) {
				log.error(err)
				log.error(`failed to read ${README_FILE}`)
				reject()
			}
			else {
				try {
					html = md_html_converter.makeHtml(markdown)
					log.info(`converted readme to html. html length = ${html.length}`)
					
					load_md_template()
					.then(function(template) {
						// insert html into template
						html = template.replace('<div id="backend-import-md"></div>',html)
						
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

// main

compile_readme()
.then(() => {
	log.info('compilation of readme passed')
})
.catch(() => {
	log.critical('compilation of readme failed')
})
