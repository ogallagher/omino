/**
 * @typedef {string} LangCode 
 * 
 * @typedef {import('./logger.js').Logger} Logger
 * 
 * @typedef {{
 * 	in_id: number
 * 	out_id: number
 * 	out_lang: LangCode
 * 	out_val: string
 * }} FetchLongestSubstringRes
 * 
 * @typedef {{
 * 	def_id: number
 * 	value: string
 * 	language: LangCode
 * }} FetchDefinitionsByIdRes
 * 
 * @typedef {{[index_in_input: number]: FetchLongestSubstringRes}} SourcePhrases
 * 
 * @typedef {{
 * 	idx: number
 * 	in_id: number
 * 	in_val: string
 * 	in_lang: LangCode
 * 	out_id: number
 * 	out_val: string
 * 	out_lang: LangCode
 * }} Translation
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
const URL_KEY_TRANSLATOR_OUTPUT = 'out'

const ENDPOINT_TRANSLATE = 'fetch_definitions'
const ENDPOINT_TRANSLATE_ID = 'fetch_definitions_by_id'
const ENDPOINT_EXAMPLES_ID = 'fetch_translated_examples_by_id'
const ENDPOINT_ROOTS = 'fetch_translated_roots'
const ENDPOINT_LONG_SUBSTR = 'fetch_longest_substring'

const TRANSLATOR_TARGET_TRANSLATIONS = 'all-translations'
const TRANSLATOR_TARGET_EXAMPLES = 'all-examples'
const TRANSLATOR_TARGET_ROOTS = 'all-roots'
const TRANSLATOR_TARGET_DERIVATIVES = 'all-derivatives'
const TRANSLATOR_TARGET_SYNONYMS = 'all-synonyms'
const TRANSLATOR_TARGET_ANTONYMS = 'all-antonyms'

/**
 * @type {{[key:LangCode]: string}}
 */
const lang_code_to_name = {
	'eng': 'English',
	'spa': 'Spanish',
	'kor': 'Korean',
	'omi': 'Omino'
}
/**
 * @type {{[key:string]: LangCode}}
 */
const lang_name_to_code = {
	'english': 'eng',
	'spanish': 'spa',
	'korean': 'kor',
	'omino': 'omi'
}
/**
 * @type {{[key:LangCode]: LangCode}}
 */
const lang_code_to_default_out = {
	'omi': 'eng',
	'eng': 'omi'
}

// variables

/**
 * @type {Logger}
 */
const translator_log = new Logger('translator')

// methods

/**
 * Parse translator inputs from url query.
 * 
 * @returns {boolean} Whether to invoke translator entrypoint.
 */
function translator_read_url() {
	let log = translator_log
	let url_params = new URLSearchParams(window.location.search)
	let submit = false
	
	if (url_params.has(URL_KEY_TRANSLATOR_INPUT)) {
		let translator_input = str_to_raw_lang_ts(url_params.get(URL_KEY_TRANSLATOR_INPUT))
		log.debug(`found translator input query ${JSON.stringify(translator_input)}`)
		
		// in_lang and in_val
		$(`#${TRANSLATOR_INPUT_ID}`).html(translator_input.value)
		$(`#${TRANSLATOR_LANG_ONE_ID}`)
		.attr('data-lang',translator_input.language)
		.html(lang_code_to_name[translator_input.language])
		
		// out_lang
		if (url_params.has(URL_KEY_TRANSLATOR_OUTPUT)) {
			let translator_output_lang = url_params.get(URL_KEY_TRANSLATOR_OUTPUT)
			if (translator_output_lang.length > 3) {
				translator_output_lang = lang_name_to_code[translator_output_lang.toLowerCase()]
			}
			log.debug(`found translator output lang ${translator_output_lang}`)
			translator_update_languages('two', translator_output_lang)
			
			submit = true
		}
	}
	else {
		log.debug('no translator input query found in url params')
	}
	
	return submit
}

/**
 * Update input and output language controls.
 * 
 * @param {string} which Which language control to update.
 * @param {LangCode | string} language Name or code of language.
 */
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

/**
 * Translator entrypoint.
 * 
 * Given the translator input text, fetch and display data from the database.
 */
function translator_on_submit() {
	const log = translator_log
	const ctx = 'on_submit'

	// extract input value and language
	/**
	 * @type {string}
	 */
	const in_lang = $(`#${TRANSLATOR_LANG_ONE_ID}`).attr('data-lang')
	/**
	 * @type {string}
	 */
	const out_lang = $(`#${TRANSLATOR_LANG_TWO_ID}`).attr('data-lang')
	/**
	 * @type {string}
	 */
	let value = $(`#${TRANSLATOR_INPUT_ID}`).val()

	log.debug('before translator_parse_source', ctx)
	translator_parse_source(value, in_lang)
	.then(
		(in_phrases) => {
			log.debug('before translator_translate', `${ctx}.parse_source.then'`)
			translator_translate(in_phrases, out_lang)
			log.debug('after translator_translate', `${ctx}.parse_source.then'`)
		
			const in_phrases_list = Object.values(in_phrases)
			if (in_phrases_list.length > 0) {
				log.debug(`performing secondary queries on ${in_phrases_list.length} input phrases`, `${ctx}.parse_source.then`)
		
				// use acquired ids for input phrase to pose other queries
				// fetch examples
				translator_examples(in_phrases_list)
		
				// fetch roots
				translator_roots(in_phrases_list, out_lang)
		
				// fetch derivatives
		
				// fetch synonyms
		
				// fetch antonyms
		
				// fetch homophones
			}
			else {
				log.info(`skip secondary queries on ${in_phrases_list} input phrases`, `${ctx}.parse_source.then`)
			}
		},
		(err) => {
			log.error(`translation failed. ${err}`, `${ctx}.parse_source.catch`)
		}
	)
}

/**
 * Iterates through source text to convert to list of translatable substring phrases.
 * 
 * @param {string} value 
 * @param {string} in_lang 
 * @param {string|undefined} in_text 
 * 
 * @returns {Promise<undefined|Map<number, FetchLongestSubstringRes>>}
 */
async function translator_next_substrings(value, in_lang, in_text) {
	const log = translator_log
	const ctx = `next_substrings."${value}"`
	const regex_non_alphanumeric = /[^\w0123456789]+/

	let tokens = value.split(regex_non_alphanumeric)
	if (tokens.length == 0) {
		return
	}

	if (in_text === undefined) {
		in_text = value
	}
	
	// let floor_length = Math.max(0, tokens[0].length-1)

	/**
	 * @type {FetchLongestSubstringRes[]}
	 */
	const res_subs = await $.ajax({
		url: '/db',
		method: 'POST',
		data: {
			endpoint: ENDPOINT_LONG_SUBSTR,
			value: value,
			language: in_lang,
			floor_length: 0
		}
	})
	log.debug(`fetched endpoint=${ENDPOINT_LONG_SUBSTR}`, ctx)

	if (res_subs.length == 0) {
		return
	}

	// add longest substring to substrings
	let longest = res_subs[0]
	let longest_val = longest.out_val
	log.debug(`fetched substring ${longest_val} for ${value}`, ctx)
	/**
	 * Location of substring in unprocessed source text.
	 */
	let value_idx = value.indexOf(longest_val)
	/**
	 * Location of substring in source text.
	 */
	let in_idx = in_text.indexOf(longest_val)
	log.info(`substring ${JSON.stringify(longest)} in source at ${in_idx}`, ctx)
	
	/**
	 * @type {Map<number, FetchLongestSubstringRes>}
	 */
	let substrings = new Map()
	substrings.set(in_idx, longest)

	// remove longest substring from value
	const next_value_arr = [...value]
	next_value_arr.splice(value_idx, longest.out_val.length)
	const next_value = next_value_arr.join('').trim()
	
	// continue if there's more input to handle
	if (value_idx !== -1 && next_value.length > 0) {
		log.info('parse subsequent substrings', ctx)
		const next_substrings = await translator_next_substrings(next_value, in_lang, in_text)
		log.info('subsequent substrings done', ctx)
		
		if (next_substrings !== undefined && next_substrings.size > 0) {
			next_substrings.forEach((ns, ni) => substrings.set(ni, ns))
		}
	}
	else {
		log.info('done', ctx)
	}

	return substrings
}

/**
 * Parse source text as list of known phrases.
 * 
 * @param {string} in_text Unprocessed source text.
 * @param {LangCode} in_lang Input/source language code.
 * @returns {Promise<SourcePhrases>} Resolved source text substrings present in db.
 */
async function translator_parse_source(in_text, in_lang) {
	const ctx = 'parse_source'
	const log = translator_log
	
	// clean value
	in_text = in_text.trim()
	if (in_lang === 'omi') {
		in_text = in_text.toLowerCase()
	}
	
	// ensure language code
	if (in_lang == undefined) {
		log.warning(`translating from unknown language ${in_lang}`, ctx)
		in_lang = null
	}
	else {
		log.info(`translating ${in_lang}:${in_text}`, ctx)
	}
	
	// get longest valid substrings
	const substrings = await translator_next_substrings(in_text, in_lang)
	log.debug('return source phrases', `${ctx}.return`)
	return Object.fromEntries(substrings.entries())
}

/**
 * 
 * @param {SourcePhrases} in_phrases 
 * @param {LangCode} out_lang 
 * @returns {Promise<void>}
 */
function translator_translate(in_phrases, out_lang) {
	const log = translator_log

	// sorted keys in order of appearance in full_value
	let keys = Object.keys(in_phrases).sort(function(a,b) { return a-b })
	log.debug(`translating substrings: \n${JSON.stringify(in_phrases)}`)
	
	const out_area = $(`#${TRANSLATOR_OUTPUT_ID}`).empty()
	if (out_area.length === 0) {
		log.error(`#${TRANSLATOR_OUTPUT_ID} translations target container not found`)
		throw new Error('html container')
	}
	else {
		// clear translations container
		$(`#${TRANSLATOR_TARGET_TRANSLATIONS}`).empty()
		
		/**
		 * @type {Promise[]}
		 */
		let promises = []
		/**
		 * @type {Translation[]}
		 */
		let translations = []
		/**
		 * @type {Translation[]}
		 */
		let other_langs = []
		
		for (let k of keys) {
			promises.push(new Promise(function(resolve, reject) {
				/**
				 * @type {FetchLongestSubstringRes}
				 */
				let in_phrase = in_phrases[k]				
				$.ajax({
					method: 'POST',
					url: '/db',
					data: {
						endpoint: ENDPOINT_TRANSLATE_ID,
						id: in_phrase.out_id
					},
					/**
					 * 
					 * @param {FetchDefinitionsByIdRes[]} res 
					 */
					success: function(res) {
						log.debug(`translation ${in_phrase.out_val} --> ${JSON.stringify(res)}`)
						
						if (res.length > 0) {
							/**
							 * @type {FetchDefinitionsByIdRes|null}
							 */
							let best = null
							/**
							 * @type {FetchDefinitionsByIdRes|null}
							 */
							let best_other_lang = null
							for (let row of res) {
								const io_row = {
									idx: k,
									in_id: in_phrase['out_id'],
									in_lang: in_phrase['out_lang'],
									in_val: in_phrase['out_val'],
									out_id: row['def_id'],
									out_val: row['value'],
									out_lang: row['language']
								}
								
								if (row['language'] === out_lang) {
									if (best === null) {
										// select first translation for out language
										best = row
									}
									else {
										// handle alternate translations for out language
										// TODO other translation row['value']
									}
							
									// concat out lang translation
									translations.push(io_row)
								}
								else {
									if (best_other_lang === null) {
										best_other_lang = io_row
									}
									other_langs.push(io_row)
								}
							}
							
							if (best !== null) {
								// load result into output
								out_area.append(best['value'] + ' ')
								resolve(true)
							}
							else {
								log.warning(`translations for ${out_lang} not found; alt = ${
									lang_code_to_name[best_other_lang['out_lang']]
								}`)
								resolve(false)
							}
						}
						else {
							log.warning(`no translations found for ${in_phrase.out_id} for any output language`)
							resolve(false)
						}
					},
					error: function(err) {
						log.error(`translation failed: ${err}`)
						reject('http')
					}
				})
			}))
		}
		
		return Promise.all(promises)
		.then(() => {
			// load translations into target for definitions queries
			return translator_load_translations(translations)
		})
	}
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

function translator_examples(in_phrases) {
	const log = translator_log
	log.debug(`fetching same-language examples with translations for ${in_phrases.length} input phrases`)
	
	return new Promise(function(resolve,reject) {
		const dest = $(`#${TRANSLATOR_TARGET_EXAMPLES}`).empty()
		
		new Promise(function(resolve) {
			if (dest.length != 0) {
				// fetch examples and example components
				frontend_import_nowhere('examples')
				.then(function(examples) {
					frontend_import_nowhere('example')
					.then(function(example) {
						resolve({
							examples: examples,
							example: example
						})
					})
					.catch(reject)
				})
				.catch(reject)
			}
			else {
				resolve()
			}
		})
		.then(function(components) {
			let promises = []
			for (let in_phrase of in_phrases) {
				// in_phrase: {in_id? out_id out_lang out_val}
				let in_id = in_phrase.out_id
				let in_val = in_phrase.out_val
				let in_lang = in_phrase.out_lang
				
				promises.push(
					new Promise(function(resolve,reject) {
						$.ajax({
							url: '/db',
							method: 'GET',
							data: {
								endpoint: ENDPOINT_EXAMPLES_ID,
								id: in_id
							},
							success: function(res) {
								log.debug(`fetched ${res.length} examples`)
							
								if (res.hasOwnProperty('error')) {
									reject(res)
								}
								else if (components != undefined) {
									// add examples component to dest
									let examples = $(components.examples)
								
									examples.find('.examples-entry')
									.attr('data-lang', in_lang)
									.attr('data-dbid', in_id)
									.html(in_val)
								
									dest.append(examples)
								
									let examples_val = examples.find('.examples-val').empty()
									if (res.length == 0) {
										examples_val.html('No examples found.')
									}
									else {
										for (let row of res) {
											// load each example into examples for this phrase
											// row = {ex_id ex_val ex_lang tl_id tl_val tl_lang}
											let example = $(components.example)
									
											example.find('.example-entry')
											.attr('data-lang', row['ex_lang'])
											.attr('data-dbid', row['ex_id'])
											.html(row['ex_val'])
									
											example.find('.example-translation')
											.attr('data-lang', row['tl_lang'])
											.attr('data-dbid', row['tl_id'])
											.html(row['tl_val'])
									
											examples_val.append(example)
										}
									}
								}
								else {
									// pass examples to caller for general use
									resolve(res)
								}
							},
							error: reject
						})
					})
				)
			}
	
			Promise.all(promises)
			.then(resolve)
			.catch(reject)
		})
		.catch((err) => {
			log.error(err, 'translator_examples')
			reject(err)
		})
	})
}

function translator_roots(in_phrases,out_lang) {
	const log = translator_log
	const dest = $(`#${TRANSLATOR_TARGET_ROOTS}`).empty()
	
	const in_lang = in_phrases[0].out_lang
	if (in_lang == 'omi') {
		log.debug(`fetching roots for ${in_phrases.length} phrases`)
		
		return new Promise(function(resolve,reject) {
			new Promise(function(resolve, reject) {
				if (dest.length != 0) {
					// load roots and root components
					frontend_import_nowhere('roots')
					.then(function(roots) {
						frontend_import_nowhere('root')
						.then(function(root) {
							resolve({
								roots: roots,
								root: root
							})
						})
						.catch(reject)
					})
					.catch(reject)
				}
				else {
					// don't load container components if there's no load target
					resolve()
				}
			})
			.then(function(components) {
				let promises = []
				for (let in_phrase of in_phrases) {
					// in_phrase: {in_id? out_id out_lang out_val}
					let in_id = in_phrase.out_id
					let in_val = in_phrase.out_val
					
					promises.push(
						new Promise(function(resolve,reject) {
							$.ajax({
								url: '/db',
								method: 'GET',
								data: {
									endpoint: ENDPOINT_ROOTS,
									id: in_id,
									value: null, // only one of id or value is needed for this endpoint
									out_language: out_lang
								},
								success: function(res) {
									if (res.hasOwnProperty('error')) {
										reject(res)
									}
									else {
										log.debug(`fetched ${res.length} root-translations`)
										// group root-translation pairs by root
										// {rt_id: {type id val lang translations: [{id val lang}]}}
										let roots = {}
										for (let row of res) {
											if (roots.hasOwnProperty(row['rt_id'])) {
												// add translation to existing root
												roots[row['rt_id']].translations.push({
													id: row['tl_id'],
													val: row['tl_val'],
													lang: row['tl_lang']
												})
											}
											else {
												// add new root and translation
												let root = {
													size: null,
													type: row['rt_type'],
													id: row['rt_id'],
													val: row['rt_val'],
													lang: row['rt_lang'],
													translations: [{
														id: row['tl_id'],
														val: row['tl_val'],
														lang: row['tl_lang']
													}]
												}
												if (row.hasOwnProperty('rt_root')) {
													root.size = 'root'
												}
												else if (row.hasOwnProperty('rt_letter')) {
													root.size = 'letter'
												}
												roots[row['rt_id']] = root
											}
										}
										
										if (components != undefined) {
											// add roots component to dest
											let roots_cmpt = $(components.roots)
											
											roots_cmpt.find('.roots-entry')
											.attr('data-lang', in_lang)
											.attr('data-dbid', in_id)
											.html(in_val)
											
											dest.append(roots_cmpt)
											
											let roots_val = roots_cmpt.find('.roots-val').empty()
											if (res.length == 0) {
												roots_val.html('No roots found.')
											}
											else {
												for (let root_id of Object.keys(roots)) {
													// load each root into roots for this phrase
													let root_data = roots[root_id]
													let root_cmpt = $(components.root)
													let root_out_lang = lang_code_to_default_out[root_data['lang']]
													let url = `?${new URLSearchParams({
														q: `${root_data['lang']}:${root_data['val']}`,
														out: root_out_lang
													})}`
													
													root_cmpt.find('.root-entry')
													.attr('data-lang', root_data['lang'])
													.attr('data-dbid', root_data['id'])
													.attr('data-out-lang', root_out_lang)
													.attr('href', url)
													.attr('title', url)
													.html(root_data['val'])
													
													// load each translation into translations for root
													let tl_cont = root_cmpt.find('.root-translations')
													.attr('data-lang', out_lang)
													
													for (let tl of root_data.translations) {
														tl_cont.append($(
															`<div data-dbid="${
																tl.id
															}" data-lang="${
																tl.lang
															}" class="mx-2">${
																tl.val
															}</div>`
														))
														log.debug(`loaded ${tl.val} into tl_cont.length=${tl_cont.length}`)
													}
													roots_val.append(root_cmpt)
												}
											}
										}
										else {
											// pass roots to caller for general use
											resolve(roots)
										}
									}
								},
								error: reject
							})
						})
					)
				}
	
				Promise.all(promises)
				.then(resolve)
				.catch(reject)
			})
			.catch(reject)
		})
	}
	else {
		const lang_name = lang_code_to_name[in_lang]
		log.debug(`roots unsupported for language ${in_lang} = ${lang_name}`)
		if (dest.length != 0) {
			dest.html(`Roots unsupported for language: ${lang_name}.`)
		}
		return Promise.resolve()
	}
}

function translator_load_translations(translations) {
	const log = translator_log
	
	let dest = $(`#${TRANSLATOR_TARGET_TRANSLATIONS}`)
	if (dest.length != 0) {
		log.info(`loading ${translations.length} translations into #${TRANSLATOR_TARGET_TRANSLATIONS}`)
		
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
					idx: translation['idx'],
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
			// load definition component
			frontend_import_nowhere('definition')
			.then(function(def_component) {
				let keys = Object.keys(translations).sort(
					function(ak,bk) { 
						return translations[ak]['idx']-translations[bk]['idx']
					}
				)
				$('.translation').each(function(i) {
					// translation = { lang val id idx outs:[{lang val id}] }
					let translation = translations[keys[i]]
					
					// load translation data into component
					let self = $(this)
					
					// input phrase
					self.find('.translation-entry')
					.attr('data-lang', translation['lang'])
					.attr('data-dbid', translation['id'])
					.attr('data-out-lang', lang_code_to_default_out[translation['lang']])
					.html(translation['val'])
					log.debug(`loaded translation entry ${translation['lang']}:${translation['val']}`)
					
					// insert definition components
					let defs_container = self.find('.translation-val').empty()
					
					for (let out of translation['outs']) {
						let def = $(def_component)
					
						let url = `?${
							new URLSearchParams({
								q: `${out['lang']}:${out['val']}`,
								out: lang_code_to_default_out[out['lang']]
							}).toString()
						}`
						
						// load definition entry
						def.find('.definition-entry')
						.attr('href',url)
						.attr('title',url)
						.attr('data-lang',out['lang'])
						.attr('data-dbid',out['id'])
						.attr('data-out-lang',lang_code_to_default_out[out['lang']])
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
								log.debug(`loaded ${definitions.length} definitions for ${out['val']}`)
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

// main called when DOM is ready
// see https://api.jquery.com/ready/
$(function() {
	if (translator_read_url()) {
		// if in and out params are defined, autosubmit translation
		translator_on_submit()
	}
	
	$(TRANSLATOR_LANG_ONE_OPTION_SELECTOR).on('click', function() {
		translator_update_languages('one', $(this).html())
	})
	$(TRANSLATOR_LANG_TWO_OPTION_SELECTOR).on('click', function() {
		translator_update_languages('two', $(this).html())
	})
	$(`#${TRANSLATOR_LANG_SWAP_ID}`).on('click', function() {
		let lang_one = $(`#${TRANSLATOR_LANG_ONE_ID}`).attr('data-lang')
		let lang_two = $(`#${TRANSLATOR_LANG_TWO_ID}`).attr('data-lang')
		
		// swap languages
		translator_update_languages('one', lang_two)
		translator_update_languages('two', lang_one)
	})
	
	$(`#${TRANSLATOR_SUBMIT_ID}`).on('click', translator_on_submit)
})

// backend exports for testing
if (typeof exports !== 'undefined') {
	exports.ENDPOINT_LONG_SUBSTR = ENDPOINT_LONG_SUBSTR
	
	exports.translator_parse_source = translator_parse_source
}