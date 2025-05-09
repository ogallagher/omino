// backend imports
const assert = require('assert')
const JSDOM = require('jsdom').JSDOM
const window = new JSDOM(
    `<!DOCTYPE html><body>empty page</body>`,
    {
        url: 'https://localhost?k1=v1'
    }
).window
const $ = require('jquery')(window)
require('jquery-mockjax')($, window)
const fetchmock = require('fetch-mock').default.mockGlobal()

// frontend imports
const Logger = require('../public/js/logger.js').Logger

// expose globals to simulate frontend
global.window = window
global.$ = $
global.Logger = Logger

const t = require('../public/js/translator.js')

/**
 * Module logger.
 */
const log = new Logger('tests.translator', Logger.LEVEL_DEBUG)

describe('translator_parse_source', () => {
    const text_1 = 'main mino'

    before(() => {
        // mock server fetches
        /**
         * @type {t.FetchLongestSubstringRes[]}
         */
        const res_longest_substring_main_mino = [
            [{
                in_id: -1,
                out_id: 0,
                out_lang: 'omi',
                out_val: 'main'
            }],
            [{
                in_id: -1,
                out_id: 0,
                out_lang: 'omi',
                out_val: 'mino'
            }]
        ]

        fetchmock.config.allowRelativeUrls = true
        fetchmock.config.matchPartialBody = true

        for (let [idx, value] of [text_1, 'mino'].entries()) {
            // mock ajax
            $.mockjax({
                url: '/db',
                data: {
                    endpoint: t.ENDPOINT_LONG_SUBSTR,
                    value: value,
                    language: 'omi'
                },
                responseText: res_longest_substring_main_mino[idx]
            })
            /* mock fetch (not used)
            fetchmock.route(
                {
                    url: '/db',
                    body: {
                        endpoint: t.ENDPOINT_LONG_SUBSTR,
                        value: value,
                        language: 'omi'
                    }
                },
                JSON.stringify(res_longest_substring_main_mino[idx])
            )
            */
        }
    })

    it('resolves list of known phrases', async function() {
        // disable mocha test timeout
        this.timeout(0)
        
        const in_phrases = await t.translator_parse_source(
            text_1, 'omi', 'eng'
        )
        assert.strictEqual(Object.keys(in_phrases).length, 2, 'expect 2 separate words')
        assert.strictEqual(in_phrases[text_1.indexOf('main')].out_val, 'main')
        assert.strictEqual(in_phrases[text_1.indexOf('mino')].out_val, 'mino')
    })
})
