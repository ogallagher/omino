/*

Owen Gallagher
2021-04-11

*/

// methods

function str_to_raw_lang_ts(raw, language_default) {
	// determine language and value
	let lang_code = /^\w{3}:/m
	let language = language_default
	let value = raw
	
	if (raw.search(lang_code) != -1) {
		language = raw.substring(0,3)
		value = raw.substring(4)
	}
	
	return {
		language: language,
		value: value,
		timestamp_ms: Math.floor(new Date())
	}
}

// exports

if (typeof exports != 'undefined') {
	exports.str_to_raw_lang_ts = str_to_raw_lang_ts
}