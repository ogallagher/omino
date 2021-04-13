/*

Owen Gallagher
2021-04-11

*/

// constants

const TRANSLATOR_INPUT_ID = 'translator-input'
const TRANSLATOR_OUTPUT_ID = 'translator-output'
const TRANSLATOR_LANG_ONE_ID = 'lang-select-one'
const TRANSLATOR_LANG_ONE_OPTION_SELECTOR = '.dropdown.lang-one .dropdown-item'
const TRANSLATOR_LANG_TWO_ID = 'lang-select-two'
const TRANSLATOR_LANG_TWO_OPTION_SELECTOR = '.dropdown.lang-two .dropdown-item'
const TRANSLATOR_LANG_SWAP_ID = 'lang-swap'
const TRANSLATOR_SUBMIT_ID = 'translator-submit'
const URL_KEY_TRANSLATOR_INPUT = 'q'

const ENDPOINT_TRANSLATE = 'fetch_definitions'
const ENDPOINT_TRANSLATE_ID = 'fetch_definitions_by_id'

const TRANSLATOR_TARGET_TRANSLATIONS = 'all-translations'
const TRANSLATOR_TARGET_EXAMPLES = 'all-examples'
const TRANSLATOR_TARGET_ROOTS = 'all-roots'
const TRANSLATOR_TARGET_DERIVATIVES = 'all-derivatives'
const TRANSLATOR_TARGET_SYNONYMS = 'all-synonyms'
const TRANSLATOR_TARGET_ANTONYMS = 'all-antonyms'

const lang_code_to_name = {
	'eng': 'English',
	'spa': 'Spanish',
	'kor': 'Korean',
	'omi': 'Omino'
}
const lang_name_to_code = {
	'english': 'eng',
	'spanish': 'spa',
	'korean': 'kor',
	'omino': 'omi'
}

// variables

const translator_log = new Logger('translator')

// methods

function translator_read_url() {
	let log = translator_log
	let url_params = new URLSearchParams(window.location.search)
	
	if (url_params.has('q')) {
		let translator_input = str_to_raw_lang_ts(url_params.get('q'))
		log.debug(`found translator input query ${JSON.stringify(translator_input)}`)
		
		$(`#${TRANSLATOR_INPUT_ID}`).html(translator_input.value)
		$(`#${TRANSLATOR_LANG_ONE_ID}`).html(lang_code_to_name[translator_input.language])
	}
	else {
		log.debug('no translator input query found in url params')
	}
}

function translator_update_languages(which, language) {
	let log = translator_log
	
	// define language name and code
	let lang_name = language
	let lang_code = language
	if (language.length > 3) {
		lang_code = lang_name_to_code[lang_name.toLowerCase()]
	}
	else {
		lang_name = lang_code_to_name[lang_code]
	}
	
	log.debug(`setting language ${which} to ${lang_name}=${lang_code}`)
	
	// update language buttons
	let other
	if (which == 'one') {
		other = 'two'
	}
	else {
		other = 'one'
	}
	
	$(`#lang-select-${which}`)
	.html(lang_name)
	.attr('data-lang', lang_code)
}

function translator_on_submit() {
	// extract input value and language
	let language = $(`#${TRANSLATOR_LANG_ONE_ID}`).html()
	let value = $(`#${TRANSLATOR_INPUT_ID}`).val()
	
	translator_translate(value,language)
	.then(function(in_id) {
		// use acquired id for input phrase to pose other queries
		// fetch examples
		
		// fetch roots
		
		// fetch derivatives
		
		// fetch synonyms
		
		// fetch antonyms
		
		// fetch homophones
	})
	.catch(function() {
		// fail quietly
	})
}

function translator_translate(value,language) {
	const log = translator_log
	
	return new Promise(function(resolve,reject) {
		// clean value
		value = value.trim().toLowerCase()
	
		// ensure language code
		if (language.length > 3) {
			language = lang_name_to_code[language.trim().toLowerCase()]
		}
		log.info(`translating ${language}:${value}`)
		if (language == undefined) {
			log.warning(`unrecognized language ${language}`)
			language = null
		}
	
		$.ajax({
			method: 'POST',
			url: '/db',
			data: {
				endpoint: ENDPOINT_TRANSLATE,
				value: value,
				language: language
			},
			success: function(res) {
				log.debug(`translation result: ${JSON.stringify(res)}`)
			
				const out_area = $(`#${TRANSLATOR_OUTPUT_ID}`)
				const out_lang = $(`#${TRANSLATOR_LANG_TWO_ID}`).attr('data-lang')
			
				if (res.length == 0) {
					out_area.html('translation not found')
					reject()
				}
				else {
					// pull input string id from first row
					let in_id = res[0]['in_id']
					resolve(in_id)
					
					let best = null
					let translations = []
					let other_langs = []
					
					for (let row of res) {
						if (row['out_lang'] == out_lang) {
							if (best == null) {
								// select first translation for out language
								best = row
							}
							else {
								// handle alternate translations for out language
								// TODO other translation row['out_val']
							}
							
							// concat out lang translation
							translations.push(row)
						}
						else {
							other_langs.push(row)
						}
					}
				
					if (best != null) {
						// load result into output
						out_area.html(best['out_val'])
					}
					else {
						let follow_up
						if (other_langs.length != 0) {
							follow_up = `Did you mean to translate to ${
								lang_code_to_name[other_langs[0]['out_lang']]
							}?`
						}
						else {
							follow_up = 'No other languages found.'
						}
					
						out_area.html(`Translation not found for current output language. ${follow_up}`)
					}
					
					// load translations into target for definitions queries
					translator_load_translations(translations)
				}
			},
			error: function(err) {
				log.error(`translation failed: ${err}`)
				reject()
			}
		})
	})
}

function translator_define(value,language) {
	const log = translator_log
	log.debug(`defining ${language}:${value}`)
	
	return new Promise(function(resolve,reject) {
		if (typeof value == 'number') {
			// value is db string id
			$.ajax({
				url: '/db',
				method: 'GET',
				data: {
					endpoint: ENDPOINT_TRANSLATE_ID,
					id: value
				},
				success: resolve,
				error: reject
			})
		}
		else {
			// value is string value, id unknown
			reject('not implemented')
		}
	})
}

function translator_load_translations(translations) {
	const log = translator_log
	
	let dest = $(`#${TRANSLATOR_TARGET_TRANSLATIONS}`).empty()
	if (dest.length != 0) {
		log.info(`loading ${translations.length} phrases into #${TRANSLATOR_TARGET_TRANSLATIONS}`)
		
		// load translation placeholders into dest
		let translation_placeholder_str = '<div class="frontend-import-translation"></div>'
		// convert [in,out] list to {in:[out]} dict
		let translations_dict = {}
		for (let i=0; i<translations.length; i++) {
			let translation = translations[i]
			let key = `${translation['in_id']}`
			 
			if (translations_dict.hasOwnProperty(key)) {
				translations_dict[key].outs.push({
					lang: translation['out_lang'],
					val: translation['out_val'],
					id: translation['out_id']
				})
			}
			else {
				translations_dict[key] = {
					lang: translation['in_lang'],
					val: translation['in_val'],
					id: translation['in_id'],
					outs: [
						{
							lang: translation['out_lang'],
							val: translation['out_val'],
							id: translation['out_id']
						}
					]
				}
				
				// load translation placeholder
				dest.append($(translation_placeholder_str))
			}
			
		}
		
		translations = translations_dict
		
		// load translation components
		frontend_import('translation')
		.then(function() {
			log.debug(`loaded ${translations.length} translation components`)
			
			// load definition component
			frontend_import_nowhere('definition')
			.then(function(def_component) {
				let keys = Object.keys(translations)
				$('.translation').each(function(i) {
					// translation = { lang val id outs:[{lang val id}] }
					let translation = translations[keys[i]]
			
					// load translation data into component
					let self = $(this)
			
					// input phrase
					self.find('.translation-entry')
					.attr('data-lang', translation['lang'])
					.attr('data-dbid', translation['id'])
					.html(translation['val'])
					log.debug(`loaded translation entry ${translation['lang']}:${translation['val']}`)
				
					// insert definition components
					let defs_container = self.find('.translation-val').empty()
				
					for (let out of translation['outs']) {
						let def = $(def_component)
					
						let url = `?${
							new URLSearchParams({
								q: `${out['lang']}:${out['val']}`
							}).toString()
						}`
					
						// load definition entry
						def.find('.definition-entry')
						.attr('href',url)
						.attr('title',url)
						.html(out['val'])
						log.debug(`loaded definition entry ${out['lang']}:${out['val']}`)
					
						// fetch definition value
						translator_define(out['id'], out['lang'])
						.then(function(res) {
							if (res == undefined || res.length == 0) {
								log.warning(
									`no definition found for ${
										out['id']
									}=${out['lang']}:${out['val']}`
								)
							}
							else {
								// select same-language definitions
								let target_lang = out['lang']
								let definitions = []
								for (let row of res) {
									// row = {def_id value language}
									if (row['language'] == target_lang) {
										definitions.push(`<span data-dbid="${row['def_id']}">${row['value']}</span>`)
									}
								}
								
								// load definition value
								def.find('.definition-value').html(definitions.join(' '))
							}
						})
						.catch(function(err) {
							log.error(`definition value fetch failed: ${err}`)
						})
					
						// append to defs container
						defs_container.append(def)
					}
				})
			})
			.catch(function(err) {
				log.error(`definition component load failed: ${err}`)
			})
		})
		.catch(function(err) {
			log.error(`translation components load failed: ${err}`)
		})
	}
	else {
		dest.html('No translations found.')
	}
}

// main

$(document).ready(function() {
	translator_read_url()
	
	$(TRANSLATOR_LANG_ONE_OPTION_SELECTOR).click(function() {
		translator_update_languages('one', $(this).html())
	})
	$(TRANSLATOR_LANG_TWO_OPTION_SELECTOR).click(function() {
		translator_update_languages('two', $(this).html())
	})
	$(`#${TRANSLATOR_LANG_SWAP_ID}`).click(function() {
		let lang_one = $(`#${TRANSLATOR_LANG_ONE_ID}`).attr('data-lang')
		let lang_two = $(`#${TRANSLATOR_LANG_TWO_ID}`).attr('data-lang')
		
		// swap languages
		translator_update_languages('one', lang_two)
		translator_update_languages('two', lang_one)
	})
	
	$(`#${TRANSLATOR_SUBMIT_ID}`).click(translator_on_submit)
})