/*

Owen Gallagher
2021-04-11

*/

// constants

const TRANSLATOR_INPUT_ID = 'translator-input'
const TRANSLATOR_OUTPUT_ID = 'translator-output'
const TRANSLATOR_LANG_ONE_ID = 'lang-select-one'
const TRANSLATOR_LANG_TWO_ID = 'lang-select-two'
const TRANSLATOR_SUBMIT_ID = 'translator-submit'
const URL_KEY_TRANSLATOR_INPUT = 'q'

const ENDPOINT_TRANSLATE = 'fetch_definitions'

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

function translator_on_submit() {
	// extract input value and language
	let language = $(`#${TRANSLATOR_LANG_ONE_ID}`).html()
	let value = $(`#${TRANSLATOR_INPUT_ID}`).val()
	
	translator_translate(value,language)
}

function translator_translate(value,language) {
	const log = translator_log
	
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
			}
			else {
				let best = null
				let other_langs = []
				
				for (let row of res) {
					if (row['out_lang'] == out_lang) {
						if (best == null) {
							best = row
						}
						else {
							log.debug(`TODO other translation ${value}=${row['out_val']}`)
						}
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
			}
		},
		error: function(err) {
			log.error(`translation failed: ${err}`)
		}
	})
}

// main

$(document).ready(function() {
	translator_read_url()
	
	$(`#${TRANSLATOR_SUBMIT_ID}`).click(translator_on_submit)
})