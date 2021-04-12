/*

Owen Gallagher
2021-04-11

*/

// constants

const TRANSLATOR_INPUT_ID = 'translator-input'
const TRANSLATOR_OUTPUT_ID = 'translator-output'
const TRANSLATOR_LANG_ONE_ID = 'lang-select-one'
const TRANSLATOR_LANG_TWO_ID = 'lang-select-two'
const URL_KEY_TRANSLATOR_INPUT = 'q'

const lang_code_to_name = {
	'eng': 'English',
	'spa': 'Spanish',
	'kor': 'Korean',
	'omi': 'Omino'
}

// variables

translator_log = new Logger('translator')

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

// main

$(document).ready(function() {
	translator_read_url()
})