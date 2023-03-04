<!--

Owen Gallagher
2021-04-05

-->

# Omino

Omino is another proposed international auxiliary language. 

**_Another one? You must be joking. Haven't you ever heard of [Esperanto](https://en.wikipedia.org/wiki/Esperanto)? Or Ido? Interlingua? Novial? Volapuk? Kotava? Toki Pona? Et Cetera?_**

Yes, another one. Admittedly, I understand it's a long shot to expect much from another attempt at inventing a universal second language after so many have already been attempted, with a language like Esperanto steadily gaining true international use and relevance.

However, there are some drawbacks to the existing constructed languages I've seen so far that I hope Omino can address. So even if it doesn't advance to the major leagues itself, perhaps the principles espoused, and approaches used to achieve them, can inform existing more successful auxiliary languages of possible improvements.

Realistically, it'll probably just pose an interesting thought experiment, which isn't such a bad thing either.

## Principles

**intuitive** The grammar and meanings are intuitive. Omino relies heavily on the theory of [phonosemantics](#inherent-meanings-of-letters) for the derivation of words.

**simple** Simplify whenever possible.

**formulaic** Etymology and grammar are consistent. This in the hope that the language is easily extensible and that initial concepts continue to be relevant as more of the language is learned. This is expressed in attempted orthogonality when possible; for example, almost every noun root has corresponding verb and adjective/adverb forms.

**universal** Nation and culture agnostic sounds and meanings. A shared auxiliary language should be easy to learn, for anyone, regardless of their first language.

**concise** Say more with fewer words. The economy of a language is especially important if it's an auxiliary language.

**precise** Communicate meaning unambiguously.

I believe it's pretty indisputable that the leading candidate for a universal second language is currently Esperanto, so it's the drawbacks of this language that I'm particularly trying to address with Omino.

## History

The name "Omino" is derived from **mino**, which means **language** or **communication** <sup id="a1">[1](#mino-etymology)</sup>, and the letter "O". **O** is the first letter in Owen Gallagher (language creator's name) and in Omino, the letter O has inherent meanings of **neutrality** and **awareness**.

At this time, Omino is too underdeveloped to have much of a biography, so we'll leave it at that.

## Development and collaboration

The software for this webserver is open-source, available for reference and collaboration at [github.com/ogallagher/omino](https://github.com/ogallagher/omino). 

All content on the site is licensed under [CC-BY 4.0](http://creativecommons.org/licenses/by/4.0/), so you can pretty much do whatever you want with it as long as I'm credited as a source.

## Alphabet

The current working alphabet for Omino is a subset of the Latin alphabet used by most European languages. The sound assigned to each letter is officially fully consistent, though there are a couple cases of intentional flexibility to allow for different pronunciations of the same spelling depending on the speaker's preference. The full alphabet is divided into three categories:

### Vowels

U O A E I

These are meant to be pronounced as they would be in Spanish, and should be as pure as possible.<sup id="a2">[2](#implicit-dipthongs)</sup> However, 

Below is a set of valid pronunciations for each vowel:

| Omino letter | IPA | English examples | Spanish examples |
| --- | --- | --- | --- |
| U | u y | b**oo**t p**oo**l | men**ú** ll**u**via |
| O | o | g**oa**l h**o**le | v**o**lver cay**ó** |
| A | a ɑ ɒ ɔ | s**o**ck h**a**ll | c**a**nto **á**tomo |
| E | e ɛ | p**e**n s**e**t | desd**é**n m**e**nos |
| I | i | t**ee**th s**ee**m | s**i**no as**í** |

### Soft consonants

M L N S/Z F/V *H*

| Omino letter | IPA | English examples | Spanish examples |
| --- | --- | --- | --- |
| M | m | **m**onth ha**m**ster | **m**es ca**m**ino |
| L | l l̪ | **l**ess se**l**f | me**l**ón so**l** |
| N | n ŋ  | **n**ote pi**n**e si**ng**er | pi**n**o e**n**ojo ta**ng**o |
| S Z | s z ʃ ʒ ð θ | **c**entury de**s**ert **z**ebra la**th**e  | **s**al**s**a ca**z**ar |
| F V | f v β | a**f**ter ad**v**enture | **f**a**v**or |
| H | h x | **h**elpful | **j**amón **g**ene |

Soft consonants are a subset of consonants that are allowed to directly precede another consonant without a vowel between them. This distinction is useful when inventing new words and deciding on proper [grammar suffixes](#grammar-suffixes), and is implemented as a measure to ensure ease of pronunciation and listening comprehension.

See [pronunciation](#pronunciation) for an explanation of the letter pairs S/Z and F/V.

Note that H is **not** included as a valid preconsonant in Omino, though it can be pronounced. H is therefore never placed at the end of a syllable, as it can be difficult to enunciate and hear. See [H pronunciation notes](#pronunciation-h).

To illustrate, consider pronouncing the following preconsonant-heavy syllables:

Mamslansfmla

It's admittedly difficult, but less so when compared to these, using hard consonants:

Babdkadkbda

### Hard consonants

B/P D/T G/K

| Omino letter | IPA | English examples | Spanish examples |
| --- | --- | --- | --- |
| B P | b p | may**b**e ga**p**ing | **b**alón ca**p**a |
| D T | d t | me**d**ical pa**t**en**t** | pa**t**o me**d**io |
| G K | g k | a**g**ain **c**arrot ma**k**e | **gu**erra ma**g**o a**c**á |

These are consonants that temporarily obstruct the airway and therefore cannot be heard individually when strung together (and are also more difficult to pronounce). For this reason, they are never placed as final letters in a syllable, as in [grammar suffixes](#grammar-suffixes).

See [pronunciation](#pronunciation) for an explanation of the letter pairs.

## Inherent meanings of letters

At the most elemental level are individual sounds, as Omino seeks to take intuition and derivation of meaning all the way to the level of individual letters in the phonetic alphabet.

- **U**: negativity, loss, death, darkness, depth
- **O**: neutrality, awareness, wholeness
- **A**: life, comfort, goodness, health
- **E**: stillness, uniformity, slowness
- **I**: energy, change, sharpness, difference
- **M**: comfort, flow, goodness
- **L**: flow, motion, pleasantness
- **N**: completion, satisfaction, effort
- **SZ**: whispering, drift, invisibility, intangibility
- **FV**: struggle, discomfort, effort
- **BP**: bulk, stillness, fatigue, weight
- **DT**: energy, light, contact
- **GK**: sharpness, light, speed
- **H**: breath, existence, peace

These inherent were chosen wholly based on personal intuition, trusting that life experience, exposure to various languages, time, and an open mind would allow for decent approximations of what each sound should mean, on average, to any person regardless of the language they speak. This also supposes that such a "universal meaning" should exist, inspired by the theory of [phonosemantics](https://en.wikipedia.org/wiki/Sound_symbolism), and experiments involving the ["Bouba/kiki effect"](https://en.wikipedia.org/wiki/Bouba/kiki_effect).

## Pronunciation

See the alphabet sections on [vowels](#vowels), ["soft" consonants](#soft-consonants), and ["hard" consonants](#hard-consonants) for pronunciation of each letter.

Generally, pronunciation of each letter is pure and consistent. There are no accents, tones, or syllable stress rules. However, there are some permitted, but not required, exceptions:

<span id="pronunciation-h">**H** can be pronounced as a breath (English **h**ello), a [loose k](https://en.wikipedia.org/wiki/Voiceless_velar_fricative) or some other approximant, or be skipped altogether.</span> Skipping H's should only be done at the beginning of a word, or for dipthong (two vowel) syllables. Note that skipping pronunciation of an H will inevitably add ambiguity. For example:

abo mon aki = habo mon haki &rarr; I live peacefully.

Omino does not distinguish between voiced and voiceless consonants that are otherwise considered to be the same. For example, Z and S are interchangable, as are D and T, both when writing and when pronouncing a word. Ideally, a single letter would represent both sounds. This choice was made in an effort to lower the point of entry for different languages where a voiced or unvoiced version of the consonant may not exist, or where the same consonant may be voiced or unvoiced depending on the letters around it. 

Interchangable consonant voicings also has the added benefit of avoiding ambiguity when whispered, where the voice is absent.

For ease and simplicity, in this document the following letters will be used per voiced-voiceless pair:

- **S**
- **F**
- **B**
- **D**
- **K**

**ZS** can also be pronounced as a [loose t](https://en.wikipedia.org/wiki/Voiceless_dental_fricative) (**th**in) or [loose d](https://en.wikipedia.org/wiki/Voiced_dental_fricative) (**th**is), as would happen naturally with a frontal lisp.

## Grammar

### Word order

Word order in Omino is not fully prescribed, though there are a few **R**ules and **S**uggestions:

**R** Each grammatical part of the sentence must not break.

**R** Adverbs and adjectives must be next to those words that they modify.

**S** Place adjectives/adverbs before the noun/verb that they modify.

**S** Subject first; the overall sentence order should either look like `[Aj-S Av-V Aj-O] (SVO)` or `[Aj-S Aj-O Av-V] (SOV)`.

**S** Verb last, at least in nested clauses. Otherwise, the nested object will get double-suffixed.

Consider the following example with nested clauses:

```
hasobo  fudia       hoam    fuakin  haobom  len     baki    .
he     (yesterday  (food    eat   ) person) like    sleeps  .
```

Given flexible word order, note the inner clause could be written as Subject-Adjective(Object-Verb) instead:

```
hasobo  fudia       haobo   fuaki   hoamnm   len     baki   .
he     (yesterday   person (eat     food  )) like    sleeps .
```

Now, **hoamnm** is an object of the inner clause, the tail of the description of **haobo**, and the tail of the object of **lekin**. It is to avoid such situations that the suggestions listed above are helpful.

### Verb and adjective agreement

There is no gender or number agreement between nouns and adjectives, or nouns and verbs.

### Grammar suffixes

These are letters or groups of letters appended to a word to define its semantic/grammatical function within the sentence.

Verb: **ki**. This is ambiguous, but easiest, and usually enough if the context obviates whether the active or passive meanings should be understood. See the respective [active](#suffix-active-verb)- and [passive](#suffix-passive-verb)-specific suffixes for most clarity.

Subject: **bo**

Object/Object of Preposition: **m**

Indirect Object: **f**

Adjective/Adverb/Possession: **n**

Preposition: **l**

Past verb: **f**

Future verb: **s**

Plural noun: **s**

<span id="suffix-active-verb">Active Verb</span>: **mki**. This is a simplification of **m kiki**, which is also valid, meaning the verb root is actively "being done" (kiki).

<span id="suffix-passive-verb">Passive Verb</span>: **nei**. Nei represents "idleness", where the subject is not performing the action, but rather being acted upon.

### Composite grammar suffixes

The above suffixes can (and inevitably will) be combined when a word has more than one grammatical function, especially when it's at the end of a phrase.

Example: **leo = literature,writing**

- verb 
    - present
        - ambiguous: **leoki = writes, is written**
        - active: **leomki = writes**
        - passive: **leonei = is written**
    - future
        - ambiguous: **leokis = will write, will be written**
        - active: **leomkis = will write**
        - passive: **leoneis = will be written**
    - past
        - ambiguous: **leokif = wrote, was written**
        - active: **leomkif = wrote**
        - passive: **leoneif = was written**
- noun
    - singular
        - ambiguous: **leo = literature**
        - subject: **leobo**
        - object: **leom**
    - plural
        - ambiguous: **leos = writings**
        - subject: **leobos**
        - object: **leoms** or **leosm**
- adjective
    - descriptive: **leon = literary**
    - ambiguous: **leokin = that writes, that is written**
    - active: **leomkin = that is writing**
    - passive: **leonein = that is written**
- possessive
    - ambiguous
        - singular: **leon = of literature**
        - plural: **leons = of writings** or **leosn**
    - subject
        - singular: **leobon = of literature**
        - plural: **leobons = of writings** or **leobosn**
    - object
        - singular: **leomn = of literature**
        - plural: **leomsn = of writings** or **leonsm** or **leosmn** or **leosnm** or **leonms** or **leomns**
- adverb
    - descriptive: **leon = literarily, in a literary way**
    - ambiguous: **leokin = writing, being written**
    - active: **leomkin = writing**
    - passive: **leonein = being written**

In cases of adjacent consonants that are difficult to pronounce (ex. **leonms**), a short unstressed vowel can be inserted. For example:

**leonms** &rarr; **leon-m-s**, where **-** is something like n**u**t or w**oo**d

### Pronouns

#### Subject

|  English  | Omino |
| ------------ |--------- |
| I | habo |
| You | hane |
| He | haso |
| She | hasa |
| They (singular) | hase |
| One | hao |
| It | ho |
| This | neho |
| That (context) | ho |
| That (far) | seho |
| We | habos |
| You, Y'all | hanes |
| They (masculine) | hasos |
| They (feminine) | hasas |
| They (plural) | hases |
| These | nehos |
| Those (context) | hos |
| Those (far) | sehos |

#### Possesive and adjective

|  English  | Omino |
| ------------ |--------- |
| My | habon |
| Your | hanen |
| His | hason |
| Her | hasan |
| Their (singular) | hasen |
| Ones | haon |
| Its | hon |
| This | nen |
| That (context) | hon |
| That (far) | sen |
| Our | habons |
| Your (plural) | hanens |
| Their (plural) | hasens |

#### Object

|  English  | Omino |
| ------------ |--------- |
| Me | habom |
| You | hanem |
| Him | hasom |
| Her | hasam |
| Them (singular) | hasem |
| It | hom |
| This | nehom |
| That (context) | hom |
| That (far) | sehom |

#### Reflexive

|  English  | Omino |
| ------------ |--------- |
| Myself | habon huo, huobo |
| Yourself | hanen huo, huone |
| Himself | hason huo, huoso |
| Herself | hasan huo, huosa |
| Themselves (singular) | hasen huo, huose |
| Oneself | haon huo, huo |
| Itself | hon, huo |
| Ourselves | habon huos, huobos |
| Yourselves | hanen huos, huones |
| Themselves (masculine) | hason huos, huosos |
| Themselves (feminine) | hasan huos, huosas |
| Themselves (plural) | hasen huos, huoses |
| Themselves (thing) | haon huos, huos |

### Prepositions

I think the creation of prepositions from nouns is the most confusing part of this system, made obvious by the fact that 
most nouns don't have any resultant prepositions.

I create preposition versions of nouns by something that resembles this logic:

 1. The preposition here: "The dog is near the house" is used to describe how the "is" is done, like an adverb or adjective, but with an object afterwards.
 1. A preposition is like an adverb that can act on an object. The above example sentence answers the question: "How is the dog in relation to the house?"

Ex: what noun creates near? Nearness, or closeness. If I were to describe the dog's existence in relation to the house, 
I could say it's a relationship of closeness.
Ex: what noun creates before? Before-ness (the past). If I baked before you baked, then my act of baking was the past in 
relation to your act of baking.
Ex: what noun creates toward? Toward-ness (direction). If I go toward the mountain, then my movement is the direction of 
the mountain.

It at first appears that prepositions could be optional, instead allowing adjectives and adverbs to have objects. However, consider the problems with this example:

Preposition: Abo sil Bm hiki = A builds above B  
Adverb: Abo sikin Bm hiki = A builds above B, A builds a lifted B, A builds while lifting B

One issue here is that B could be an object of sikin or hiki and is therefore ambiguous. Is A building B, which is lifted, or is A building and lifting B? The other issue is that sin is high/tall and sikin is raised/lifted. Neither of these is quite appropriate to mean "above".

### Clauses

A clause a phrase that with minimal effort could be its own sentence, with its own subject. In Omino, the clause can be appended the appropriate grammar suffix directly.

#### m = Object of verb or preposition

I know **that he is coming**. &rarr; habobo hasobo nekim noki.  

Note in this example putting the subject first avoids confusion of something like:  

I know **that he is coming**. &rarr; habobo neki hasobom noki.  

Where **hasobom** has both a subject and object suffix at the same time, and where **habobo neki** suggests the wrong subject for the verb of the inner clause.

The sale of the house was before **they thought it would happen**. &rarr; habeam kebuekibo fulil hasesbo keim noikif.

#### n = Adjective or adverb

He eats, having been the one who ate food yesterday. &rarr; hasobo fudia hoam fuakin fuaki.  
He sleeps like the one who ate food yesterday. &rarr; hasobo fudia hoam fuakin haobom len baki.

### Sentences

There is no notion of a "complete sentence" in Omino, unlike English, where a subject and verb are required at minimum. As such, implied words can be dropped. The subject, for example, can often be omitted, as in English commands.

Below are some examples of allowed sentences in Omino that would be considered incomplete in English.

nen ho hien. &rarr; This (is, is like) furniture. 

sieki men suen sehom. &rarr; (Look at) that strange and floating thing.

### Capitalization

Capitalization is not used in Omino, though it can optionally be used for proper names (names of people, places) to avoid ambiguity.

### Superlatives and comparison

Comparative and superlative modifiers are simply a subset of general descriptors.

**sinan** = too, overly

**hoen** = all, every, each

**nan** = much, many, a lot of

**kuon** = some, partly, partial

**stion** = little, few, small

**fun** = lack of, none

**snan** = increasingly, more

**sfun** = decreasingly, less, fewer

**nuin** = most, best, top

**neun** = least, worst, bottom

**nen** = almost, nearly

**fain** = hardly, barely

### Numbers and counting

Numbers are a subset of omino [roots](#roots) chosen to be as intuitive as possible, short to pronounce, and different in sound so as not to be confused with each other. Since numbers are also words and therefore have at least two meanings, a number can be suffixed with **keo**, which means "count" or "number", do avoid ambiguity.

When describing counts/quantities, the descriptive **n** suffix is normally appended, again to avoid ambiguity.

| Numeral | Omino | English |
| --- | --- | --- |
| -1 | hiu he | negative/minus one, not existence |
| 0 | fu | zero, absence |
| 1 | he | one, existence |
| 2 | kao | two, eye |
| 3 | lo | three, direction |
| 4 | hu | four, stillness |
| 5 | die | five, hand |
| 6 | su | six, depth |
| 7 | sue | seven, strangeness |
| 8 | mi | eight, movement |
| 9 | loe | nine, normalcy |
| 10 | na | ten, abundance |
| 100 | do | hundred, largeness |
| 1000 | nado / bao<sup id="a3">[3](#thousand)</sup> | thousand, planet |

**lon baos men suen dias** &rarr; three years and seven days

**hasabo die keon haim kaki** &rarr; she wants five animals

**hasebos diedominakao daems kaofudia miekif** &rarr; they gave 582 hugs the day before yesterday

### Missing and imitating complexity

Omino's principles resist using more complicated tenses, cases, modes, and such, but it makes sense to stretch the grammatical capabilities of the language in the future if it's to be considered as a viable and complete form of communication. Below are some meanings that are currently not well/precisely defined in Omino.

#### Conditional tense

There is official conditional/hypothetical tense yet. Below are some candidates:

Add a verb ending using **foki (m fon kiki) = uncertainty+action** or **kei = occurrence** for the conditional. 

Afoki Bki. &rarr; If A were to happen, B happens.  
Akei Bki. &rarr; If A happens, B happens.

Use a preposition like **hel = in/at/on** or **beol = originating from** or **neokeil = causing** or **beokeil = because of**.

Akim hel Bki. &rarr; In the event of  A happening, B happens.  
Akim beol Bki. &rarr; Originating from A, B happens.  
Akim beokeil Bki &rarr; As a result of A, B happens.  
Bkim neokeil Aki &rarr; A happens, causing B.

Use adverb(s) like **neokein = as a result/effect** and **beokein = as a cause** paired.

beokein Aki neokein Bki. &rarr; Cause A, effect B. A happening as a cause, B happens as a result.
beon Aki neon Bki. &rarr; Origin A, destination B. Coming from A happening, B would happen.

neokein Bki? &rarr; Effect B? Would B happen?
neon Bki? &rarr; Destination B? Would B happen?

#### Present progressive vs Present simple

There is no distinction between these tenses with pure verb conjugation. However, progressive can be expressed by creating an adverb phrase to modify a state verb, like **heki**. For example:

I write in the house. &rarr; habo habeam hel **leoki**.

I am writing in the house. &rarr; habo habeam hel **leomkin heki**.

Note that **leomkin** is used instead of **leon** (literarily) or **leokin** (ambiguous): 

I am literarily in the house &rarr; habo hel habeam **leon heki**.

I am being written in the house. &rarr; habo hel habeam **leokin/leonein heki**.

#### Perfect in past, present, and future

The perfect tense is similar to the construction of the progressive, using the `nei` passive ending instead of the `ki` active ending.

I speak &rarr; habo mioki<br>
I am speaking &rarr; habo miokin heki<br>
I have spoken &rarr; habo miokin henei

I spoke &rarr; habo miokif<br>
I was speaking &rarr; habo miokin hekif<br>
I had spoken &rarr; habo miokin heneif

I will speak &rarr; habo miokis<br>
I will be speaking &rarr; habo miokin hekis<br>
I will have spoken &rarr; habo kiokin heneis

#### Past imperfect, past future/predective

Consider the different meanings of the following phrases:

```
English                     | Spanish               | Omino
----------------------------------------------------------
happened                    | pasó                  | keikif
used to happen              | pasaba                | ?.. son            (unknown)
would/was going to happen   | pasaría/iba a pasar   | ?.. solio len soki (still don't know how)
```

These tenses are not yet defined.

#### Reflexive

If the subject's verb is acting on the subject itself, "self" can be the object for clarity, or the object can be omitted, the intransitive form allowing for the reflexive as a possible meaning. For example:

hane huki. &rarr; You clean. / You clean yourself.

hane huom huki. &rarr; You clean yourself.  
hane hanen huom huki &rarr; You clean yourself.  
hane huonem huki. &rarr; You clean yourself.

#### Subjunctive

There is no subjunctive tense yet.

I want **that you eat** this plant. &rarr; habobo hanebo nen buam fuakim kaki.

We see **that she eats** the plant. &rarr; habobos hasabo buam fuakim koaki.

#### Command

There is no verb conjugation for a command. Currently, form a command by posing it as a request:

Will you feed my friend?  &rarr; hanebo habon hamem hoakis?  
Can you feed my friend?  &rarr; hanebo hamem lien hoakis? hanebo hamem hoakin lieki?

Or by stating it as fact.

You feed my friend. &rarr; hanebo habon hamem hoaki.  
You can feed my friend. &rarr; habon hamem hoaki.

In both cases, similar to **por favor** in Spanish and 제발 in Korean, you can add "as a favor/please" to be polite, with **doamie = favor/help giving &rarr; doamien = as a favor**:

Will you feed my friend, please? &rarr; hanebo hamem hoaki doamien?  
You feed my friend, please. &rarr; hamem doamien hoaki.

#### Conjunctions

There're no separate grammar rules for conjunctions, and are instead mimicked using the `n` adjective/adverb/descriptive suffix. Below are some examples.

| Omino | English |
| --- | --- |
| men | **and**, additionally |
| fin | **or**, differently |
| hiun | **but**, **though**, negatively |
| feun | **however**, **but**, opposingly |
| beon | **so**, **therefore**, as the origin |

## Roots

After [individual letters](#inherent-meanings-of-letters), the next level of complexity in derivation of meaning is the [syllable](https://en.wikipedia.org/wiki/Syllable), which in Omino has the following components:

- One or two consonants. If **H**, optionally silent. If two, the first must be a [preconsonant](soft-consonants). A root word is only allowed to use **S** as the preconsonant; all others were considered too difficult to pronounce.
- One or two vowels.
- Zero, one, or two consonants, all of which must be [preconsonants](soft-consonants). A root word will not have any final consonants, as the end is reserved for [grammar suffixes](#grammar-suffixes).

Each root is a monosyllable noun, chosen as a fitting embodiment of the combination of letters within it.

### Single vowel roots

|       |  h  |  m  |  l  |  n  |  s  |  f  |  b  |  d  |  k  |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **u** | hu - stillness | mu - want not | lu - removal | nu - darkness | su - lowness,depth | fu - absence,lack | bu - ground | du - sadness | ku - death |
| **o** | ho - thing,it | mo - peace | lo - direction | no - knowledge | so - ignorance | fo - uncertainty | bo - importance | do - size | ko - appearance |
| **a** | ha - life | ma - water | la - music | na - abundance | sa - air | fa - achievement | ba - sleep,rest | da - happiness | ka - desire |
| **e** | he - existence | me - addition | le - similarity | ne - proximity | se - distance | fe - fatigue | be - place,location | de - touch,feeling | ke - repetition |
| **i** | hi - creation | mi - movement | li - time | ni - simplicity | si - height | fi - difference | bi - destruction | di - light | ki - action |

### All roots (simple, dipthong, double consonant)

|       |  h  |  m  |  l  |  n  |  s  |  f  |  b  |  d  |  k  | sm | sn | sf | sp | st | sk |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **u**  | hu - stillness | mu - want not | lu - removal | nu - darkness | su - lowness,depth | fu - absence,lack | bu - ground | du - sadness | ku - death | sm | snu - shadow | sfu - decrease | spu - secret | st | sk |
| **uo** | huo - whisper,self |  muo - torso,chest  |  luo  |  nuo  |  suo  |  fuo - emptiness  |  buo  |  duo  |  kuo - piece,part | sm | sn | sf | sp | st | sk |
| **ua** | hua  |  mua - kiss |  lua  |  nua - experience |  sua - invisibility |  fua - consumption |  bua - plant |  dua  |  kua - hole,stab | sm | sn | sf| sp | st | sk |
| **ue** | hue - weakness |  mue  |  lue  |  nue - captivity |  sue - strangeness |  fue - laziness |  bue - weight |  due - shape,form |  kue - danger | sm | sn | sf| sp | st | sk |
| **ui** | hui - artificiality |  mui - flow,current |  lui - sliding,slipping |  nui - top |  sui - steepness |  fui - weapon |  bui - business |  dui - chaos,disorder |  kui - speed | sm | sn | sf| sp | st | sk |
| **ou** | hou |  mou - want not  |  lou - age  |  nou - falsehood |  sou - emptiness  |  fou |  bou - respect |  dou |  kou  | sm | sn | sf| sp | st | sk |
| **o**  | ho - thing,it | mo - peace | lo - direction | no - knowledge | so - ignorance | fo - uncertainty | bo - importance | do - size | ko - appearance | sm | sno - flavor,taste | sf| sp | st | sk |
| **oa** | hoa - food |  moa - truth |  loa - love |  noa - body |  soa |  foa |  boa - head |  doa - help |  koa - hope  | sm | sn | sf| sp | st | sk |
| **oe** | hoe - whole |  moe - smoothness |  loe - normalcy |  noe - possession |  soe - luck,randomness |  foe |  boe - fullness |  doe - finding |  koe - reflection | sm | snoe - familiarity | sf| sp | st | skoe - moon |
| **oi** | hoi - tool |  moi  |  loi - exposure,vulnerability |  noi - thought |  soi - weightlessness |  foi - fear |  boi - vehicle |  doi - emotion |  koi - color | smoi - journey | sn | sf | sp | st | skoi - rainbow |
| **au** | hau  |  mau - ice  |  lau  |  nau  |  sau - rain |  fau - sickness |  bau - preservation |  dau - extraction |  kau  | sm | sn | sf| sp | st | sk |
| **ao** | hao - person |  mao - mouth |  lao - art |  nao - ear |  sao - nose |  fao |  bao - world |  dao  - gratitude |  kao - eye | sm | snao - tongue | sf| sp | st | sk |
| **a**  | ha - life | ma - water | la - music | na - abundance | sa - air | fa - achievement | ba - sleep,rest | da - happiness | ka - desire | sma - breath | sna - increase | sf| sp | st | ska - request |
| **ae** | hae |  mae |  lae - family |  nae - stickiness,attraction |  sae - freedom |  fae |  bae - order |  dae - hug,embrace |  kae | sm | sn | sf | sp | st | sk |
| **ai** | hai - animal |  mai - youth |  lai |  nai - belief |  sai - cloud |  fai - effort,attempt |  bai |  dai - fire |  kai - fun | smai - steam | sn | sf | sp | st | skai - comedy |
| **eu** | heu - singularity  |  meu  |  leu - departure |  neu - bottom  |  seu - quiet |  feu - opposition,negativity |  beu - solid |  deu - frown |  keu - pain | sm | sn | sf| sp | steu - dryness | sk |
| **eo** | heo - balance |  meo - roundness |  leo - literature |  neo - destination |  seo |  feo |  beo - origin |  deo - nature,universe |  keo - count,number | sm | sneo - goal,target | sf| sp | st | sk |
| **ea** | hea - health,safety |  mea - good |  lea - ease |  nea - affirmation,positivity |  sea - alien |  fea - irritation,itchiness |  bea - cover,protection | dea - smile | kea - labor,work | sm | sn | sf| sp | st | sk |
| **e**  | he - existence | me - addition | le - similarity | ne - proximity | se - distance | fe - fatigue | be - place,location | de - touch,feeling | ke - repetition | sme - meeting | sne - edge,border | sf| sp | ste - arm | sk |
| **ei** | hei - type |  mei - liquid |  lei - season |  nei - idleness |  sei - gas |  fei - difficulty |  bei - moment |  dei - heat | kei - occurrence | sm | sn | sf| sp | st | sk |
| **iu** | hiu - no,disagreement  |  miu - snow  |  liu - taking,greed |  niu - deception,trick |  siu - loss |  fiu - dissatisfaction | biu - cold | diu - bad | kiu - slaughter | smiu - foot | sn | sf| sp | st | sk |
| **io** | hio - voice |  mio - speech,conversation |  lio - method |  nio - sound |  sio - smell |  fio - curiosity |  bio - responsibility,obligation | dio - strength,force | kio | sm | sn | sf| sp | stio - smallness | sk |
| **ia** | hia - yes,agreement |  mia - swimming |  lia - throat |  nia - satisfaction |  sia - flight |  fia - throw |  bia - clothing |  dia - sun,star |  kia - jump,hop | sm | sn | sf| sp | st | sk |
| **ie** | hie - furniture |  mie - giving,generosity |  lie - ability |  nie - arrival |  sie - sky |  fie - roughness |  bie - control,command |  die - hand |  kie - hit,impact | sm | sn | sf| sp | st | sk |
| **i**  | hi - creation | mi - movement | li - time | ni - simplicity | si - height | fi - difference | bi - destruction | di - light | ki - action | smi - leg | sni - surface | sfi - change | sp | st | ski - sharpness |

## Omino shortcomings

1. Flexibility and simplicity are unfortunately at odds with specificity and richness. As such, Omino allows for sentences with more ambiguity than other languages by not defining a strict word order, and lacks ways to concisely express more complicated grammar, in favor of using existing elements.
2. The formulaic use of grammar suffixes can make the language less aesthetically pleasing, as the same sounds will appear over and over again, at similar places within a sentence.

## Footnotes

<b id="mino-etymology">1</b> **mino** in turn comes from **mi** (movement) and **no** (knowledge). [&#8617;](#a1)

<b id="implicit-dipthongs">2</b> In some languages there are implicit vowel dipthongs, even when only a single vowel is written. "No", for example, can be pronounced "N-uh-oh-oo". In Omino, this never happens. [&#8617;](#a2)

<b id="thousand">3</b> I plan to stick with **bao** as the preferred name, as in English, where each thousand gets a new name. However, **nado** could also work (10*100). [&#8617;](#a3)
