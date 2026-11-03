import { Strand, Skill, Activity, Learner, ClassGroup, TeachingGroup } from '../types/simphonics';

export const SIMPHONICS_STRANDS: Strand[] = [
  {
    id: 'oral_language',
    name: 'Oral language and listening',
    shortName: 'Oral Language',
    description: 'Vocabulary, following instructions, storytelling and listening discrimination',
    color: '#0284C7', // Sky / Azure
    iconName: 'MessageSquare',
  },
  {
    id: 'phonological_awareness',
    name: 'Phonological awareness',
    shortName: 'Phonological',
    description: 'Recognising rhyme, identifying syllables and noticing initial sounds',
    color: '#0D9488', // Teal
    iconName: 'Music',
  },
  {
    id: 'phonemic_awareness',
    name: 'Phonemic awareness',
    shortName: 'Phonemic',
    description: 'Oral blending, segmenting, and later phoneme addition, deletion and substitution',
    color: '#6366F1', // Indigo
    iconName: 'Ear',
  },
  {
    id: 'phonics_decoding',
    name: 'Phonics and decoding',
    shortName: 'Phonics & Decoding',
    description: 'Taught sound–spelling correspondences, blending, segmenting for spelling and cumulative word reading',
    color: '#D97706', // Warm Amber
    iconName: 'BookOpen',
  },
  {
    id: 'handwriting_foundations',
    name: 'Handwriting foundations',
    shortName: 'Handwriting Prep',
    description: 'Shoulder stability, bilateral coordination, hand–eye coordination, fine-motor and pre-writing patterns',
    color: '#E11D48', // Rose
    iconName: 'Activity',
  },
  {
    id: 'letter_formation',
    name: 'Letter formation and transcription',
    shortName: 'Letter Formation',
    description: 'Formation, orientation, spacing, sizing and short independent writing',
    color: '#8B5CF6', // Purple
    iconName: 'PenTool',
  },
  {
    id: 'word_text_reading',
    name: 'Word and text reading',
    shortName: 'Word Reading',
    description: 'Decodable words, carefully selected common exception words and connected texts',
    color: '#059669', // Emerald
    iconName: 'FileText',
  },
  {
    id: 'comprehension_expression',
    name: 'Comprehension and expression',
    shortName: 'Comprehension',
    description: 'Vocabulary discussion, retelling, sequencing and meaning-making',
    color: '#475569', // Slate
    iconName: 'Brain',
  },
];

export const SIMPHONICS_SKILLS: Skill[] = [
  // 1. Oral Language & Listening
  {
    id: 'ol_1',
    strandId: 'oral_language',
    code: 'OL-1',
    name: 'Two-step spoken directions',
    description: 'Listens to and executes two linked verbal instructions without repeated prompting.',
    level: 'Foundations',
    prerequisites: ['Single-step command following'],
    teacherInstruction: 'Say clearly once: "Touch your ears, then gently tap your knees." Do not gesture.',
    promptOrMaterial: 'No materials needed. Verbal delivery only.',
    lookFor: 'Does the child remember and sequence both actions without hesitation or needing a repeat?',
  },
  {
    id: 'ol_2',
    strandId: 'oral_language',
    code: 'OL-2',
    name: 'Descriptive object vocabulary',
    description: 'Uses descriptive words (colour, texture, size, function) when describing a concrete classroom item.',
    level: 'Foundations',
    prerequisites: ['Naming familiar common objects'],
    teacherInstruction: 'Place a textured item (e.g., a pinecone or smooth stone) in front of the child. Ask: "Tell me three words that describe this."',
    promptOrMaterial: 'Natural tactile object.',
    lookFor: 'Provides at least two attributes beyond basic color (e.g., "bumpy", "hard", "heavy").',
  },
  {
    id: 'ol_3',
    strandId: 'oral_language',
    code: 'OL-3',
    name: 'Environmental sound discrimination',
    description: 'Identifies and differentiates subtle indoor and outdoor sounds without visual clues.',
    level: 'Foundations',
    prerequisites: ['Attentive listening routine'],
    teacherInstruction: 'Behind a light screen, shake a box of paperclips, then keys. Ask: "Which sound made a sharp jingle?"',
    promptOrMaterial: 'Two sound-making objects behind screen.',
    lookFor: 'Accurately distinguishes and identifies the sound source.',
  },

  // 2. Phonological Awareness
  {
    id: 'pa_1',
    strandId: 'phonological_awareness',
    code: 'PA-1',
    name: 'Rhyme recognition',
    description: 'Distinguishes between rhyming and non-rhyming spoken word pairs.',
    level: 'Foundations',
    prerequisites: ['Listening to nursery rhymes'],
    teacherInstruction: 'Say: "Listen: cat... hat. Do they sound the same at the end? Now listen: sun... cup. Do they rhyme?"',
    promptOrMaterial: 'Spoken word pairs.',
    lookFor: 'Distinguishes ending rhyme pattern independently without visual clues.',
  },
  {
    id: 'pa_2',
    strandId: 'phonological_awareness',
    code: 'PA-2',
    name: 'Syllable clapping & count',
    description: 'Taps or claps the rhythmic beats (syllables) in spoken 2- and 3-syllable everyday words.',
    level: 'Foundations',
    prerequisites: ['Steady rhythmic beat tapping'],
    teacherInstruction: 'Say: "Let\'s clap the beats in your name: Fe-li-ci-ty! Now try \'butter-fly\'."',
    promptOrMaterial: 'Spoken multi-syllabic words.',
    lookFor: 'Accurately breaks the word into rhythmic syllable chunks with clapping or stomping.',
  },
  {
    id: 'pa_3',
    strandId: 'phonological_awareness',
    code: 'PA-3',
    name: 'Alliteration & initial sound noticing',
    description: 'Notices when two spoken words begin with the same initial sound.',
    level: 'Foundations',
    prerequisites: ['Rhyme recognition'],
    teacherInstruction: 'Say: "Listen: snake... sun. Both start with /s/! Does \'tiger\' start with /s/ too?"',
    promptOrMaterial: 'Spoken alliterative pairs.',
    lookFor: 'Identifies whether words share the same initial sound without seeing letters.',
  },

  // 3. Phonemic Awareness
  {
    id: 'pm_1',
    strandId: 'phonemic_awareness',
    code: 'PM-1',
    name: 'Oral blending (2–3 phonemes)',
    description: 'Combines separately spoken pure phonemes to identify the whole word.',
    level: 'Foundations',
    prerequisites: ['Alliteration and initial sound awareness'],
    teacherInstruction: 'Say pure sounds smoothly with 1-second pause: "/s/ ... /a/ ... /t/". Ask: "What word am I saying?"',
    promptOrMaterial: 'Voice only. No letter cards shown.',
    lookFor: 'Does the learner blend the phonemes into "sat" independently, with slight prompt, or unable?',
  },
  {
    id: 'pm_2',
    strandId: 'phonemic_awareness',
    code: 'PM-2',
    name: 'Oral segmenting into phonemes',
    description: 'Breaks a spoken CVC word into its individual constituent sounds.',
    level: 'Foundations',
    prerequisites: ['Oral blending'],
    teacherInstruction: 'Say: "The word is \'pan\'. Can you tap out all the sounds you hear in \'pan\'?"',
    promptOrMaterial: 'Spoken words + finger tapping.',
    lookFor: 'Produces /p/ - /a/ - /n/ in order without inserting extra schwa (/puh/).',
  },
  {
    id: 'pm_3',
    strandId: 'phonemic_awareness',
    code: 'PM-3',
    name: 'Initial phoneme isolation',
    description: 'Isolates and utters the first pure sound in a spoken word.',
    level: 'Foundations',
    prerequisites: ['Alliteration noticing'],
    teacherInstruction: 'Say: "What is the very first sound you hear in the word \'moon\'?"',
    promptOrMaterial: 'Spoken words.',
    lookFor: 'Isolates /m/ as a pure continuous sound, not /muh/.',
  },

  // 4. Phonics & Decoding
  {
    id: 'ph_1',
    strandId: 'phonics_decoding',
    code: 'PH-1',
    name: 'Set 1 Correspondences: s, a, t, p',
    description: 'Recognises and produces pure sounds for graphemes s, a, t, p upon visual presentation.',
    level: 'Level 1',
    prerequisites: ['Oral sound discrimination'],
    teacherInstruction: 'Flash lowercase card \'s\', then \'a\', \'t\', \'p\'. Ask: "What sound does this make?"',
    promptOrMaterial: 'Simphonics Set 1 Flashcards.',
    lookFor: 'Instant recognition within 2 seconds with clean pure pronunciation (no added schwa).',
  },
  {
    id: 'ph_2',
    strandId: 'phonics_decoding',
    code: 'PH-2',
    name: 'Set 2 Correspondences: i, n, m, d',
    description: 'Recognises and produces pure sounds for graphemes i, n, m, d upon visual presentation.',
    level: 'Level 1',
    prerequisites: ['Set 1 Correspondences'],
    teacherInstruction: 'Flash card \'m\', \'d\', \'i\', \'n\'. Ask learner for the sound.',
    promptOrMaterial: 'Simphonics Set 2 Flashcards.',
    lookFor: 'Pure sound production: /m/ hum, /d/ light plosive, /i/ short, /n/ nasal.',
  },
  {
    id: 'ph_3',
    strandId: 'phonics_decoding',
    code: 'PH-3',
    name: 'Blending CVC printed words',
    description: 'Points to graphemes in a printed regular word, sounds them out, and blends left-to-right.',
    level: 'Level 1',
    prerequisites: ['Set 1 Correspondences', 'Oral blending'],
    teacherInstruction: 'Show word card "pat". Guide finger: "Say the sounds as I point: /p/ /a/ /t/. Now blend it!"',
    promptOrMaterial: 'Simphonics Word Card "pat", "sat", "tap".',
    lookFor: 'Matches each grapheme to sound accurately and connects smoothly into whole word.',
  },

  // 5. Handwriting Foundations
  {
    id: 'hw_1',
    strandId: 'handwriting_foundations',
    code: 'HW-1',
    name: 'Shoulder stability & gross-motor control',
    description: 'Maintains upright core stability and controls large arm movements during tabletop or vertical surface work.',
    level: 'Foundations',
    prerequisites: ['Postural control when seated'],
    teacherInstruction: 'Have the child stand at an easel or chalkboard and draw large sweeping circular motions with straight arms.',
    promptOrMaterial: 'Vertical board or easel + thick chalk.',
    lookFor: 'Moves smoothly from shoulder joint without collapsing trunk or leaning heavily.',
  },
  {
    id: 'hw_2',
    strandId: 'handwriting_foundations',
    code: 'HW-2',
    name: 'Pincer grasp & finger isolation',
    description: 'Holds a short writing tool or peg using thumb and index finger with middle finger support (dynamic tripod or quadrupod).',
    level: 'Foundations',
    prerequisites: ['Palmar grasp maturation'],
    teacherInstruction: 'Provide small golf pencil or broken crayon. Observe grip during continuous mark making.',
    promptOrMaterial: 'Short crayon / golf pencil + paper.',
    lookFor: 'Fingers are relaxed, pencil held between index and thumb, not in full fisted fist.',
  },
  {
    id: 'hw_3',
    strandId: 'handwriting_foundations',
    code: 'HW-3',
    name: 'Pre-writing patterns (zig-zags, waves)',
    description: 'Traces and replicates continuous pre-writing movement patterns from left to right.',
    level: 'Foundations',
    prerequisites: ['Shoulder stability'],
    teacherInstruction: 'Demonstrate wave pattern in sand tray or paper: "Up the hill, down the slide, without lifting!"',
    promptOrMaterial: 'Sand tray or printed rhythm sheet.',
    lookFor: 'Continuous fluid rhythm across the line from left to right.',
  },

  // 6. Letter Formation & Transcription
  {
    id: 'lf_1',
    strandId: 'letter_formation',
    code: 'LF-1',
    name: 'Continuous stroke formation (c, a, d)',
    description: 'Starts at the top-right entry point ("curly c" family) and completes counter-clockwise loop without lifting pencil.',
    level: 'Level 1',
    prerequisites: ['Pincer grasp', 'Pre-writing patterns'],
    teacherInstruction: 'Say: "Start at the dot, pull back around like a curl, up to close, and flick." Model on board.',
    promptOrMaterial: 'Simphonics Formation Card \'a\'.',
    lookFor: 'Correct starting point, direction of movement, and consistent base sitting.',
  },
  {
    id: 'lf_2',
    strandId: 'letter_formation',
    code: 'LF-2',
    name: 'Down-and-bounce formation (r, n, m, p)',
    description: 'Starts top, travels down, bounces back up the same stem without lifting pencil before creating arch.',
    level: 'Level 1',
    prerequisites: ['Pincer grasp'],
    teacherInstruction: 'Demonstrate \'n\': "Down to the line, bounce back up, over the bridge, and down."',
    promptOrMaterial: 'Line guide or tactile tracing card.',
    lookFor: 'Does not lift pencil; re-traces initial vertical stroke cleanly.',
  },

  // 7. Word & Text Reading
  {
    id: 'wr_1',
    strandId: 'word_text_reading',
    code: 'WR-1',
    name: 'Decodable CVC word list reading',
    description: 'Accurately decodes a list of 5 cumulative words containing taught correspondences.',
    level: 'Level 1',
    prerequisites: ['PH-1', 'PH-2', 'PM-1'],
    teacherInstruction: 'Present word sheet: sat, pin, map, tin, pan. Ask learner to read aloud.',
    promptOrMaterial: 'Simphonics Decodable Word Strips.',
    lookFor: 'Independent decoding of at least 4 of 5 words without teacher prompting.',
  },
  {
    id: 'wr_2',
    strandId: 'word_text_reading',
    code: 'WR-2',
    name: 'Exception word recognition ("the", "to", "I")',
    description: 'Recognises selected high-frequency exception words on sight without phonetic breakdown.',
    level: 'Level 1',
    prerequisites: ['Cumulative CVC familiarity'],
    teacherInstruction: 'Flash card "the". Say: "This is a tricky word. We cannot sound out the whole word yet. We say \'the\'."',
    promptOrMaterial: 'Exception Word Flashcards.',
    lookFor: 'Instant automatic recall of the word without sounding letter-by-letter.',
  },
  {
    id: 'wr_3',
    strandId: 'word_text_reading',
    code: 'WR-3',
    name: 'Connected decodable sentence reading',
    description: 'Reads a simple connected decodable sentence with left-to-right finger tracking and appropriate pacing.',
    level: 'Level 1',
    prerequisites: ['WR-1', 'WR-2'],
    teacherInstruction: 'Present sentence: "Pat sat in the pan." Ask child to track under words with finger and read.',
    promptOrMaterial: 'Simphonics Decodable Sentence Card #3.',
    lookFor: 'Finger tracking under each word, self-corrects sounding errors, understands meaning.',
  },

  // 8. Comprehension & Expression
  {
    id: 'ce_1',
    strandId: 'comprehension_expression',
    code: 'CE-1',
    name: 'Story retelling with beginning, middle, end',
    description: 'Recalls key sequence of events from a short read-aloud using temporal markers.',
    level: 'Foundations',
    prerequisites: ['Attentive listening'],
    teacherInstruction: 'After reading a short decodable story: "What happened first? What did Pat do next? How did it end?"',
    promptOrMaterial: 'Simphonics Book 1 Story "Sam and Pat".',
    lookFor: 'Names the characters and correctly orders the main action.',
  },
  {
    id: 'ce_2',
    strandId: 'comprehension_expression',
    code: 'CE-2',
    name: 'Predictive thinking from picture & text',
    description: 'Suggests a plausible next event based on illustrations and spoken or read text.',
    level: 'Foundations',
    prerequisites: ['Observing book illustrations'],
    teacherInstruction: 'Pause before turning page: "Look at the dog near the water. What do you think will happen next?"',
    promptOrMaterial: 'Illustrated page.',
    lookFor: 'Provides a reasoned prediction connected directly to visual or verbal clues.',
  },
];

export const SIMPHONICS_ACTIVITIES: Activity[] = [
  // 1. Oral Blending Mystery Box
  {
    id: 'act_1',
    title: 'Mystery Box Oral Blending',
    strandId: 'phonemic_awareness',
    level: 'Level 1 Foundations',
    durationMinutes: 10,
    correspondences: ['s', 'a', 't', 'p'],
    learningIntention: 'Blend spoken pure phonemes to identify concrete objects inside the mystery box.',
    prerequisites: ['Listening attention', 'Alliteration recognition'],
    preparation: 'Place 4 small toys/objects (sun, cat, cup, pen) inside an opaque box or cloth bag.',
    bookReference: 'Simphonics Activity Book 1: Sound Play, p. 8',
    materialType: 'manipulative',
    materialsNeeded: ['Opaque box or cloth pouch', '3–4 small household objects (cup, pen, pin, hat)'],
    model: 'Hold the box close. Say: "I have something inside my box. It is a /c/ ... /u/ ... /p/. Can you blend the sounds to guess what it is?" Model sweeping hand across.',
    guidedPractice: 'Say: "/s/ ... /u/ ... /n/. Let\'s say the sounds together, faster and faster: sss-uuu-nnn... SUN! Open the box to reveal."',
    independentAttempt: 'Teacher says: "/p/ ... /e/ ... /n/". Learner blends independently without teacher gestures and says "pen".',
    check: 'Record whether learner blends independently on first attempt or requires teacher to compress sound gap.',
    adaptation: {
      extraSupport: 'Shorten pause between sounds to 0.5s or tap fingers sequentially for each sound.',
      extension: 'Invite the learner to pull out a secret object and segment the sounds for the class to guess.'
    },
    audioPhoneme: {
      phoneme: '/s/ /a/ /t/',
      sampleWord: 'sat',
      description: 'Clean pure phonemes with 0.8s gap'
    },
    flashcards: [
      { id: 'fc_1', type: 'picture', front: '☀️', back: 'sun (/s/ /u/ /n/)' },
      { id: 'fc_2', type: 'picture', front: '☕', back: 'cup (/c/ /u/ /p/)' },
      { id: 'fc_3', type: 'picture', front: '🖊️', back: 'pen (/p/ /e/ /n/)' },
    ],
    printableSheet: {
      title: 'Sound Blending Picture Match',
      purpose: 'Connect spoken segmented sounds with correct picture cards.',
      instructions: 'Teacher speaks phonemes /p/ /e/ /n/. Learner colors the matching object.',
      items: ['[ ] Sun illustration', '[ ] Cup illustration', '[ ] Pen illustration']
    }
  },

  // 2. Set 1 Sound Splash (/s/, /a/, /t/, /p/)
  {
    id: 'act_2',
    title: 'Sound Splash: s, a, t, p',
    strandId: 'phonics_decoding',
    level: 'Level 1 Foundations',
    durationMinutes: 15,
    correspondences: ['s', 'a', 't', 'p'],
    learningIntention: 'Accurately articulate pure sounds for graphemes s, a, t, p and match with visual cards.',
    prerequisites: ['Oral sound discrimination'],
    preparation: 'Lay out large tactile cards for s, a, t, p on the floor mat or table.',
    bookReference: 'Simphonics Activity Book 1: Grapheme Introduction, p. 12',
    materialType: 'flashcard',
    materialsNeeded: ['Simphonics Large Letter Cards (s, a, t, p)', 'Sound button counters'],
    model: 'Show card "s". "This is /s/. Like a hissing snake: sssss. Notice my teeth are gently together: sssss. Not \'suh\'!"',
    guidedPractice: 'Show card "a". "Open mouth wide: /a/ as in apple. Let\'s make the /a/ sound three times together: /a/, /a/, /a/."',
    independentAttempt: 'Flash the four cards in random order. Learner produces pure phoneme within 2 seconds.',
    check: 'Verify absence of added vowel sound (/suh/, /tuh/, /puh/). Mark pure articulation.',
    adaptation: {
      extraSupport: 'Provide a small mirror so the child can look at their lip and tongue position.',
      extension: 'Present two cards simultaneously (e.g., "a" and "t") and ask learner to blend into "at".'
    },
    audioPhoneme: {
      phoneme: '/s/',
      sampleWord: 'sun',
      description: 'Continuous voiceless alveolar fricative'
    },
    flashcards: [
      { id: 'fc_s', type: 'letter', front: 's', back: 'Snake (/s/)' },
      { id: 'fc_a', type: 'letter', front: 'a', back: 'Apple (/a/)' },
      { id: 'fc_t', type: 'letter', front: 't', back: 'Tennis (/t/)' },
      { id: 'fc_p', type: 'letter', front: 'p', back: 'Pan (/p/)' }
    ]
  },

  // 3. Robot Talk Segmenting
  {
    id: 'act_3',
    title: 'Robot Talk Segmenting for Spelling',
    strandId: 'phonemic_awareness',
    level: 'Level 1 Foundations',
    durationMinutes: 10,
    correspondences: ['s', 'a', 't', 'p', 'i', 'n'],
    learningIntention: 'Segment spoken CVC words into individual phonemes using physical robot arm movements.',
    prerequisites: ['Oral blending', 'Initial phoneme isolation'],
    preparation: 'Prepare 5 target words: sit, tap, pin, nip, pan.',
    bookReference: 'Simphonics Activity Book 1: Robot Segmenting, p. 16',
    materialType: 'movement',
    materialsNeeded: ['Robot movement cards or toy counter chips'],
    model: 'Move arms stiffly like a robot: "I talk like a robot. When I say \'tap\', my robot voice says /t/ [chop left], /a/ [chop middle], /p/ [chop right]!"',
    guidedPractice: 'Call out \'sit\'. Lead learners in three distinct arm chops: /s/ - /i/ - /t/. Count total sounds on fingers: 1, 2, 3!',
    independentAttempt: 'Teacher says: "Robot, segment \'pin\'!" Learner performs the three sound chops and utters /p/ - /i/ - /n/.',
    check: 'Observe whether each phoneme is separated cleanly and counts to exactly 3 sounds.',
    adaptation: {
      extraSupport: 'Give learner 3 magnetic counters on an Elkonin sound box card to push up per sound.',
      extension: 'Invite learner to write the corresponding graphemes on a whiteboard after segmenting.'
    },
    audioPhoneme: {
      phoneme: '/t/ /a/ /p/',
      sampleWord: 'tap',
      description: 'Three segmented chops'
    }
  },

  // 4. Pre-Writing Sand Tray Waves
  {
    id: 'act_4',
    title: 'Sand Tray Pre-Writing Patterns',
    strandId: 'handwriting_foundations',
    level: 'Level 1 Foundations',
    durationMinutes: 10,
    correspondences: [],
    learningIntention: 'Execute continuous rhythmic wave and arch movements with pointer finger without lifting.',
    prerequisites: ['Shoulder and elbow stability'],
    preparation: 'Fill shallow tray with fine sensory sand or cornmeal.',
    bookReference: 'Simphonics Activity Book 1: Motor Patterns, p. 4',
    materialType: 'manipulative',
    materialsNeeded: ['Shallow tray with fine sand/cornmeal', 'Rhythm pattern demonstration card'],
    model: 'Place pointer finger at top left: "Down to the sea, up over the wave, down to the sea, up over the wave. Keep moving left to right!"',
    guidedPractice: 'Guide learner\'s index finger through the sand to feel the smooth curved rhythm.',
    independentAttempt: 'Learner shakes tray to erase and creates 3 linked waves across the tray independently.',
    check: 'Check for fluid continuous motion without lifting finger or reversing direction.',
    adaptation: {
      extraSupport: 'Draw a guide line in colored sand or use two fingers together for greater tactile stability.',
      extension: 'Transition pattern onto large easel paper using a chunky wax crayon.'
    }
  },

  // 5. Letter Formation: Curly 'c' to 'a'
  {
    id: 'act_5',
    title: 'Letter Formation: The "Curly c" into "a"',
    strandId: 'letter_formation',
    level: 'Level 1 Foundations',
    durationMinutes: 15,
    correspondences: ['a', 'c'],
    learningIntention: 'Form lowercase "a" using correct start point (2 o\'clock), continuous counter-clockwise curve, up to close, and down flick.',
    prerequisites: ['Pincer grip', 'Continuous pre-writing curves'],
    preparation: 'Whiteboards and dry-erase markers or chunky chalks on mini slates.',
    bookReference: 'Simphonics Activity Book 1: Letter Paths, p. 18',
    materialType: 'printable',
    materialsNeeded: ['Whiteboards or Simphonics Wipe-Clean Slate', 'Chunky dry-erase pens'],
    model: 'Draw clock circle on board: "Start at the apple stem (2 o\'clock). Pull back around the curve like /c/, zoom up to the top, slide straight down, and a tiny flick!"',
    guidedPractice: 'Air-write with whole arm: "Pull back, round, up, straight down!" Repeat three times.',
    independentAttempt: 'Learners write letter "a" 3 times on slate. Circle their favourite attempt.',
    check: 'Verify starting position and direction. Ensure child did not draw a ball then a separate stick.',
    adaptation: {
      extraSupport: 'Place a bright green sticker at the 2 o\'clock start point to anchor the visual start.',
      extension: 'Add letter \'d\' by pulling up tall to the ceiling before descending to the baseline.'
    },
    printableSheet: {
      title: 'Letter Formation Practice: Letter a',
      purpose: 'Build muscle memory for counter-clockwise curved grapheme formation.',
      instructions: 'Trace the large dotted letter path starting at the star, then write 4 independent letters.',
      items: ['[★] Start dot with arrow guide', '[—] Baseline and midline guide', '[✓] Self-check: Is your circle closed?']
    }
  },

  // 6. First Decodable Story: "Pat and Sam"
  {
    id: 'act_6',
    title: 'First Decodable Story: "Pat and Sam"',
    strandId: 'word_text_reading',
    level: 'Level 1 Foundations',
    durationMinutes: 15,
    correspondences: ['s', 'a', 't', 'p', 'i', 'n'],
    exceptionWords: ['the', 'is'],
    learningIntention: 'Read connected decodable sentences with taught correspondences, tracking smoothly under words.',
    prerequisites: ['Set 1 and 2 graphemes', 'Decodable CVC blending'],
    preparation: 'Copies of Simphonics Little Reader #1: "Pat and Sam".',
    bookReference: 'Simphonics Decodable Readers: Series 1, Book 1',
    materialType: 'decodable_text',
    materialsNeeded: ['Simphonics Reader #1 booklet', 'Reading pointer finger or tracking strip'],
    model: 'Point under first word: "P-a-t... Pat. Pat is a cat. Let\'s read the sentence together."',
    guidedPractice: 'Read sentence 2 together: "Sam sat on a mat." Pause at tricky word "on". Sound out regular words.',
    independentAttempt: 'Learner reads sentence 3 independently: "Pat sat in the pan." Answer: "Where did Pat sit?"',
    check: 'Record decoding accuracy, handling of exception words, and immediate comprehension response.',
    adaptation: {
      extraSupport: 'Pre-teach the two focus exception words ("the", "is") with rapid flashcard practice before opening book.',
      extension: 'Learner retells what happened to Pat and Sam in their own words or acts out the action.'
    },
    decodableStory: {
      title: 'Pat and Sam',
      taughtCorrespondences: ['s', 'a', 't', 'p', 'i', 'n', 'm'],
      commonExceptionWords: ['is', 'the', 'on'],
      sentences: [
        'Pat is a cat.',
        'Sam is a pup.',
        'Pat sat on a mat.',
        'Sam sat in the pit.',
        'Pat and Sam tap, tap, tap!'
      ],
      comprehensionQuestion: 'Where did Pat sit, and what did Pat and Sam do together at the end?'
    }
  },

  // 7. Rhyme Basket Discovery
  {
    id: 'act_7',
    title: 'Rhyme Basket Discovery',
    strandId: 'phonological_awareness',
    level: 'Level 1 Foundations',
    durationMinutes: 10,
    correspondences: [],
    learningIntention: 'Identify objects that share ending rhyme patterns from a shared collection.',
    prerequisites: ['Listening discrimination'],
    preparation: 'Basket with paired rhyming objects: fox/box, cat/hat, frog/log, peg/egg.',
    bookReference: 'Simphonics Activity Book 1: Rhyme Discovery, p. 10',
    materialType: 'manipulative',
    materialsNeeded: ['Wicker basket', '8 rhyming physical toys'],
    model: 'Hold up frog and log: "Frog... log! They rhyme because they end with the same sound: -og!"',
    guidedPractice: 'Hold up "fox". Ask: "Does \'hat\' rhyme with \'fox\'? Or does \'box\' rhyme with \'fox\'?"',
    independentAttempt: 'Learner picks one item from basket and finds its rhyming partner independently.',
    check: 'Records whether child matches rhyme by auditory similarity or confuses with semantic match (e.g. dog/bone).',
    adaptation: {
      extraSupport: 'Exaggerate the ending rime sound: "f-OX... b-OX".',
      extension: 'Ask learner to invent a silly nonsense word that rhymes (e.g. "zox!").'
    }
  },

  // 8. Sound Button Tap & Blend
  {
    id: 'act_8',
    title: 'Sound Button Tap & Blend',
    strandId: 'phonics_decoding',
    level: 'Level 1 Foundations',
    durationMinutes: 10,
    correspondences: ['s', 'a', 't', 'p', 'i', 'n', 'm', 'd'],
    learningIntention: 'Press visual sound buttons beneath graphemes and sweep finger left-to-right to blend whole word.',
    prerequisites: ['Set 1 & 2 graphemes', 'Oral blending'],
    preparation: 'Word cards with circular dots under single graphemes: sit, pan, mad, tip.',
    bookReference: 'Simphonics Activity Book 1: Blending Strips, p. 22',
    materialType: 'flashcard',
    materialsNeeded: ['Sound button cards', 'Finger press or tactile dot buttons'],
    model: 'Tap dot under \'s\': "beep! /s/". Tap dot under \'i\': "beep! /i/". Tap dot under \'t\': "beep! /t/". Sweep line: "SIT!"',
    guidedPractice: 'Place learner\'s finger on the buttons for "p-a-n". Tap, tap, tap, sweep together!',
    independentAttempt: 'Learner takes card "mad", taps each button independently and says whole word.',
    check: 'Observe whether sounds are smooth and connected without pausing long between phonemes.',
    adaptation: {
      extraSupport: 'Use physical press-lights or tactile felt stickers as sound buttons.',
      extension: 'Change initial sound button to read a rhyming word family (mad -> sad -> pad).'
    },
    flashcards: [
      { id: 'sb_1', type: 'word', front: 'sit', back: '/s/ · /i/ · /t/' },
      { id: 'sb_2', type: 'word', front: 'pan', back: '/p/ · /a/ · /n/' },
      { id: 'sb_3', type: 'word', front: 'mad', back: '/m/ · /a/ · /d/' },
      { id: 'sb_4', type: 'word', front: 'tip', back: '/t/ · /i/ · /p/' },
    ]
  },

  // 9. Syllable March & Drum
  {
    id: 'act_9',
    title: 'Syllable March & Drum',
    strandId: 'phonological_awareness',
    level: 'Level 1 Foundations',
    durationMinutes: 10,
    correspondences: [],
    learningIntention: 'Step or beat a drum once for each syllable in animal names and classroom objects.',
    prerequisites: ['Steady beat coordination'],
    preparation: 'Class drum or hand instruments.',
    bookReference: 'Simphonics Activity Book 1: Rhythm & Beats, p. 14',
    materialType: 'movement',
    materialsNeeded: ['Hand drum, tambourine, or rhythm sticks'],
    model: 'Drum twice for "ti-ger": BAM, BAM! "Tiger has two beats." Drum three times for "el-e-phant": BAM, BAM, BAM!',
    guidedPractice: 'March in circle: "Let\'s march for \'hip-po-pot-a-mus\'! One, two, three, four, five steps!"',
    independentAttempt: 'Teacher says: "croc-o-dile". Learner beats drum 3 times and counts beats.',
    check: 'Confirms child beats on vowel bursts rather than per phoneme sound.',
    adaptation: {
      extraSupport: 'Place chin on hand: feel mouth drop open once for every syllable.',
      extension: 'Sort animal picture cards into two piles: 1-beat animals vs 2-beat animals.'
    }
  },

  // 10. Peg Squeeze & Tweezers Fine Motor
  {
    id: 'act_10',
    title: 'Peg Squeeze & Tweezers Fine Motor',
    strandId: 'handwriting_foundations',
    level: 'Level 1 Foundations',
    durationMinutes: 10,
    correspondences: [],
    learningIntention: 'Strengthen thumb-index pincer web space using spring-loaded clothespins and jumbo tweezers.',
    prerequisites: ['Bilateral hand coordination'],
    preparation: 'Container with wooden clothespins and colored pom-poms.',
    bookReference: 'Simphonics Activity Book 1: Hand Strength, p. 2',
    materialType: 'manipulative',
    materialsNeeded: ['Spring clothespins', 'Colored pom-poms or felt balls', 'Ice cube tray'],
    model: 'Hold peg with thumb and index pad: "Open crocodile mouth wide, snap shut on the pom-pom, drop into slot."',
    guidedPractice: 'Transfer 3 pom-poms together, checking that pinky and ring finger are tucked gently into palm.',
    independentAttempt: 'Learner transfers 6 pom-poms into ice cube tray slots within 1 minute without dropping.',
    check: 'Look for active open thumb web space (circular thumb position) vs flat collapsed thumb.',
    adaptation: {
      extraSupport: 'Give a soft cotton ball for the pinky and ring fingers to hold in the palm ("tuck the sleeping baby").',
      extension: 'Use smaller beads or match pom-pom colors to numbered targets.'
    }
  },

  // 11. Down-and-Bounce Letter Tracing: n, m, p
  {
    id: 'act_11',
    title: 'Down-and-Bounce Letters: n, m, p',
    strandId: 'letter_formation',
    level: 'Level 1 Foundations',
    durationMinutes: 15,
    correspondences: ['n', 'm', 'p'],
    learningIntention: 'Trace and write vertical letters that descend and bounce back up the same stem without lifting pencil.',
    prerequisites: ['Pre-writing vertical strokes', 'Pincer grip'],
    preparation: 'Laminated tactile letter cards with raised glitter or sand lines.',
    bookReference: 'Simphonics Activity Book 1: Bounce Paths, p. 24',
    materialType: 'printable',
    materialsNeeded: ['Tactile letter cards (n, m, p)', 'Lined dry-wipe boards'],
    model: 'Trace \'n\': "Down to the grass, bounce straight back up the stem, over the umbrella bridge, and down to the grass!"',
    guidedPractice: 'Guide hand to bounce right on top of the original stroke without drifting sideways.',
    independentAttempt: 'Learners write letter \'n\' twice and letter \'m\' twice on lined paper.',
    check: 'Ensure learner does not lift marker between down-stroke and bounce-stroke.',
    adaptation: {
      extraSupport: 'Use a wider marker with a textured track sheet to guide the bounce.',
      extension: 'Introduce \'p\' descending below the line into the soil before bouncing back.'
    }
  },

  // 12. Retelling with Sequence Cards
  {
    id: 'act_12',
    title: 'Story Sequence Retelling',
    strandId: 'comprehension_expression',
    level: 'Level 1 Foundations',
    durationMinutes: 15,
    correspondences: [],
    learningIntention: 'Order 3 narrative picture cards and retell key events using "First, Next, Finally".',
    prerequisites: ['Attentive listening to stories'],
    preparation: '3 sequence cards depicting a child building a sandcastle and watching the tide wash it away.',
    bookReference: 'Simphonics Activity Book 1: Story Retell, p. 28',
    materialType: 'flashcard',
    materialsNeeded: ['3-step sequence story cards'],
    model: 'Look at cards. "First, Maya dug the sand. Next, she made towers. At the end, the wave splashed it!"',
    guidedPractice: 'Shuffle cards. "Which card shows what happened first? Why do you know that?"',
    independentAttempt: 'Learner places the 3 cards in left-to-right order and tells the whole story to partner.',
    check: 'Check logical chronological ordering and use of cohesive sequence connectors.',
    adaptation: {
      extraSupport: 'Give 2 cards (start and finish) before introducing the middle action.',
      extension: 'Ask: "What could Maya build tomorrow so the wave doesn\'t touch it?"'
    }
  },

  // 13. High-Frequency Exception Flash: "the", "to", "I"
  {
    id: 'act_13',
    title: 'Tricky Word Flash: "the", "to", "I"',
    strandId: 'word_text_reading',
    level: 'Level 1 Foundations',
    durationMinutes: 5,
    correspondences: [],
    exceptionWords: ['the', 'to', 'I'],
    learningIntention: 'Rapidly recognise and read taught common exception words without sounding out phonetically.',
    prerequisites: ['Print awareness'],
    preparation: 'Exception word cards with yellow border (Simphonics Tricky Word indicator).',
    bookReference: 'Simphonics Activity Book 1: Tricky Words, p. 30',
    materialType: 'flashcard',
    materialsNeeded: ['Simphonics Yellow Flashcards: "the", "to", "I"'],
    model: 'Hold up "the". "This word says /the/. The \'th\' and \'e\' make unexpected sounds here, so we remember it by heart!"',
    guidedPractice: 'Play "Peek-a-boo": hide card behind back, flash quickly for 1 second. Children chant "THE!"',
    independentAttempt: 'Individual rapid flash: learner reads all 3 cards accurately within 5 seconds.',
    check: 'Ensure learner says word immediately without trying to decode /t/ /h/ /e/.',
    adaptation: {
      extraSupport: 'Locate the word "the" inside a real decodable storybook and highlight with yellow translucent tape.',
      extension: 'Compose an oral sentence using two tricky words: "I ran to the tree."'
    },
    flashcards: [
      { id: 'tw_1', type: 'word', front: 'the', back: 'Common Exception Word' },
      { id: 'tw_2', type: 'word', front: 'to', back: 'Common Exception Word' },
      { id: 'tw_3', type: 'word', front: 'I', back: 'Common Exception Word' },
    ]
  },

  // 14. Initial Sound Treasure Hunt
  {
    id: 'act_14',
    title: 'Initial Sound Treasure Hunt',
    strandId: 'phonological_awareness',
    level: 'Level 1 Foundations',
    durationMinutes: 15,
    correspondences: ['s', 't', 'p', 'm'],
    learningIntention: 'Locate objects in the classroom that begin with a designated target pure sound.',
    prerequisites: ['Alliteration and initial sound noticing'],
    preparation: 'Label 4 sorting hoops with picture headers: Snake (/s/), Tiger (/t/), Pan (/p/), Moon (/m/).',
    bookReference: 'Simphonics Activity Book 1: Sound Hunt, p. 20',
    materialType: 'movement',
    materialsNeeded: ['4 sorting hoops or carpet mats', 'Classroom objects'],
    model: 'Pick up scissors: "Sss-cissors. Starts with /s/. It goes into the snake hoop!"',
    guidedPractice: 'Hand a toy pencil: "What is the first sound? /p/. Which hoop does it belong in?"',
    independentAttempt: 'Learners find one item in the room and place it in the correct sound hoop.',
    check: 'Verify whether learner isolated the initial phoneme correctly before classifying.',
    adaptation: {
      extraSupport: 'Offer 2 item choices (e.g., spoon vs car) rather than open classroom search.',
      extension: 'Ask learner to think of a friend\'s name that starts with the same sound.'
    }
  },

  // 15. Listening Walk & Sound Mapping
  {
    id: 'act_15',
    title: 'Outdoor Listening Walk',
    strandId: 'oral_language',
    level: 'Level 1 Foundations',
    durationMinutes: 15,
    correspondences: [],
    learningIntention: 'Maintain quiet focused attention on environmental sounds and describe them accurately.',
    prerequisites: ['Listening discrimination'],
    preparation: 'Clipboard and visual sound tick sheet for outdoor or corridor walk.',
    bookReference: 'Simphonics Activity Book 1: Listening Walk, p. 2',
    materialType: 'printable',
    materialsNeeded: ['Listening walk checklist', 'Teacher chime or bell'],
    model: 'Ring chime: "When the chime rings, freeze like statues, close your eyes, and listen with animal ears."',
    guidedPractice: 'Ask: "What did you hear high in the sky? What did you hear crunching under our shoes?"',
    independentAttempt: 'Learners whisper 2 different sounds they heard and whether they were loud or soft.',
    check: 'Assess ability to sustain attention and differentiate overlapping auditory stimuli.',
    adaptation: {
      extraSupport: 'Give visual cue card for eyes closed / ears open.',
      extension: 'Imitate the sound using vocal modulation (pitch and volume).'
    }
  }
];

export const INITIAL_CLASSES: ClassGroup[] = [
  { id: 'rec_a', name: 'Reception A', description: 'Early foundation literacy group (Ages 3–5)' },
  { id: 'rec_b', name: 'Reception B', description: 'Afternoon foundational reading class' },
  { id: 'found_1', name: 'Foundation Beginners', description: 'Multi-age foundation intervention group' }
];

export const INITIAL_GROUPS: TeachingGroup[] = [
  {
    id: 'grp_blend',
    classId: 'rec_a',
    name: 'Oral Blending Focus Group',
    teachingFocus: 'Practising oral blending of 3 pure phonemes (/s/, /a/, /t/, /p/)',
    learnerIds: ['lrn_1', 'lrn_3', 'lrn_5', 'lrn_7'],
    createdDate: '2026-10-24T09:00:00Z'
  },
  {
    id: 'grp_letters',
    classId: 'rec_a',
    name: 'Set 1 Correspondences Group',
    teachingFocus: 'Consolidating automatic recall of letters s, a, t, p with pure sound pronunciation',
    learnerIds: ['lrn_2', 'lrn_4', 'lrn_8'],
    createdDate: '2026-10-25T10:15:00Z'
  },
  {
    id: 'grp_grip',
    classId: 'rec_a',
    name: 'Pencil Grip & Shoulder Stability',
    teachingFocus: 'Strengthening pincer web space and upper trunk stability before formal line writing',
    learnerIds: ['lrn_2', 'lrn_6'],
    createdDate: '2026-10-26T11:00:00Z'
  }
];

export const INITIAL_LEARNERS: Learner[] = [
  {
    id: 'lrn_1',
    name: 'Amina',
    classId: 'rec_a',
    ageBand: '4–5 years',
    languageBackground: 'EAL / Bilingual (English & Somali)',
    groupId: 'grp_blend',
    currentFocus: 'Oral blending 3-phoneme words (/s/ /a/ /t/)',
    focusRationale: 'Observations show she isolates initial sounds accurately but benefits from support joining spoken sounds together into whole words.',
    createdDate: '2026-09-10T08:00:00Z',
    observations: {
      'ol_1': { skillId: 'ol_1', skillName: 'Two-step spoken directions', strandId: 'oral_language', status: 'independent', date: '2026-10-18', note: 'Follows multi-step routines with confidence.' },
      'pa_1': { skillId: 'pa_1', skillName: 'Rhyme recognition', strandId: 'phonological_awareness', status: 'independent', date: '2026-10-20', note: 'Noticed cat/hat and sun/run in storytime.' },
      'pa_2': { skillId: 'pa_2', skillName: 'Syllable clapping & count', strandId: 'phonological_awareness', status: 'independent', date: '2026-10-22', note: 'Claps 2- and 3-syllables accurately.' },
      'pm_3': { skillId: 'pm_3', skillName: 'Initial phoneme isolation', strandId: 'phonemic_awareness', status: 'independent', date: '2026-10-25', note: 'Isolates /s/ and /m/ cleanly.' },
      'pm_1': { skillId: 'pm_1', skillName: 'Oral blending (2–3 phonemes)', strandId: 'phonemic_awareness', status: 'needs_support', date: '2026-10-28', note: 'Requires modelling when gap between sounds exceeds 1 second.' },
      'ph_1': { skillId: 'ph_1', skillName: 'Set 1 Correspondences: s, a, t, p', strandId: 'phonics_decoding', status: 'developing', date: '2026-10-30', note: 'Identifies s and a; still confusing t with p.' },
      'hw_2': { skillId: 'hw_2', skillName: 'Pincer grasp & finger isolation', strandId: 'handwriting_foundations', status: 'independent', date: '2026-10-15', note: 'Mature tripod grip on short crayon.' }
    }
  },
  {
    id: 'lrn_2',
    name: 'Leo',
    classId: 'rec_a',
    ageBand: '4–5 years',
    languageBackground: 'English (Home language)',
    groupId: 'grp_grip',
    currentFocus: 'Pre-writing patterns and pincer strength',
    focusRationale: 'Exhibits strong oral language and phonemic awareness, but shows hand fatigue during tabletop writing tasks.',
    createdDate: '2026-09-10T08:00:00Z',
    observations: {
      'ol_1': { skillId: 'ol_1', skillName: 'Two-step spoken directions', strandId: 'oral_language', status: 'independent', date: '2026-10-19' },
      'pa_1': { skillId: 'pa_1', skillName: 'Rhyme recognition', strandId: 'phonological_awareness', status: 'independent', date: '2026-10-21' },
      'pm_1': { skillId: 'pm_1', skillName: 'Oral blending (2–3 phonemes)', strandId: 'phonemic_awareness', status: 'independent', date: '2026-10-24', note: 'Blends /p/ /e/ /n/ and /c/ /a/ /t/ instantly.' },
      'ph_1': { skillId: 'ph_1', skillName: 'Set 1 Correspondences: s, a, t, p', strandId: 'phonics_decoding', status: 'independent', date: '2026-10-27', note: 'Produces clean pure sounds without schwa.' },
      'hw_1': { skillId: 'hw_1', skillName: 'Shoulder stability & gross-motor control', strandId: 'handwriting_foundations', status: 'developing', date: '2026-10-28', note: 'Tends to slump over desk during seated work.' },
      'hw_2': { skillId: 'hw_2', skillName: 'Pincer grasp & finger isolation', strandId: 'handwriting_foundations', status: 'needs_support', date: '2026-10-29', note: 'Frequently switches back to full palmar fist.' }
    }
  },
  {
    id: 'lrn_3',
    name: 'Maya',
    classId: 'rec_a',
    ageBand: '3–4 years',
    languageBackground: 'English (Home language)',
    groupId: 'grp_blend',
    currentFocus: 'Syllables and oral blending with counters',
    focusRationale: 'Younger learner in Reception; developing confidence in hearing individual sound parts.',
    createdDate: '2026-09-12T08:00:00Z',
    observations: {
      'ol_1': { skillId: 'ol_1', skillName: 'Two-step spoken directions', strandId: 'oral_language', status: 'developing', date: '2026-10-15', note: 'Sometimes completes step 1 and needs reminder for step 2.' },
      'pa_2': { skillId: 'pa_2', skillName: 'Syllable clapping & count', strandId: 'phonological_awareness', status: 'developing', date: '2026-10-20' },
      'pm_1': { skillId: 'pm_1', skillName: 'Oral blending (2–3 phonemes)', strandId: 'phonemic_awareness', status: 'needs_support', date: '2026-10-26', note: 'Enjoys robot talk game with teacher modelling.' }
    }
  },
  {
    id: 'lrn_4',
    name: 'Tariq',
    classId: 'rec_a',
    ageBand: '4–5 years',
    languageBackground: 'EAL / Bilingual (English & Arabic)',
    groupId: 'grp_letters',
    currentFocus: 'Set 1 Letter recognition and orientation',
    focusRationale: 'Has keen auditory awareness; currently working on connecting sounds to Latin graphemes.',
    createdDate: '2026-09-12T08:00:00Z',
    observations: {
      'pa_1': { skillId: 'pa_1', skillName: 'Rhyme recognition', strandId: 'phonological_awareness', status: 'independent', date: '2026-10-18' },
      'pm_1': { skillId: 'pm_1', skillName: 'Oral blending (2–3 phonemes)', strandId: 'phonemic_awareness', status: 'independent', date: '2026-10-22' },
      'ph_1': { skillId: 'ph_1', skillName: 'Set 1 Correspondences: s, a, t, p', strandId: 'phonics_decoding', status: 'developing', date: '2026-10-29', note: 'Recognises s and t; practising a and p.' }
    }
  },
  {
    id: 'lrn_5',
    name: 'Chloe',
    classId: 'rec_a',
    ageBand: '4–5 years',
    languageBackground: 'English (Home language)',
    groupId: 'grp_blend',
    currentFocus: 'Oral segmenting for spelling',
    focusRationale: 'Blends spoken words easily; now learning to chop words into individual sounds for writing.',
    createdDate: '2026-09-15T08:00:00Z',
    observations: {
      'pm_1': { skillId: 'pm_1', skillName: 'Oral blending (2–3 phonemes)', strandId: 'phonemic_awareness', status: 'independent', date: '2026-10-20' },
      'pm_2': { skillId: 'pm_2', skillName: 'Oral segmenting into phonemes', strandId: 'phonemic_awareness', status: 'developing', date: '2026-10-27', note: 'Can isolate first and last sound; working on middle vowel.' },
      'ph_1': { skillId: 'ph_1', skillName: 'Set 1 Correspondences: s, a, t, p', strandId: 'phonics_decoding', status: 'independent', date: '2026-10-28' },
      'ph_3': { skillId: 'ph_3', skillName: 'Blending CVC printed words', strandId: 'phonics_decoding', status: 'developing', date: '2026-10-31', note: 'Blends "sat" and "tap" with sound buttons.' }
    }
  },
  {
    id: 'lrn_6',
    name: 'Ethan',
    classId: 'rec_a',
    ageBand: '5–6 years',
    languageBackground: 'English (Home language)',
    groupId: 'grp_grip',
    currentFocus: 'Letter formation for "c" family (c, a, d)',
    focusRationale: 'Older beginner needing reinforcement on consistent anti-clockwise starting points.',
    createdDate: '2026-09-15T08:00:00Z',
    observations: {
      'hw_2': { skillId: 'hw_2', skillName: 'Pincer grasp & finger isolation', strandId: 'handwriting_foundations', status: 'independent', date: '2026-10-18' },
      'lf_1': { skillId: 'lf_1', skillName: 'Continuous stroke formation (c, a, d)', strandId: 'letter_formation', status: 'needs_support', date: '2026-10-28', note: 'Starts letter \'a\' at bottom instead of 2 o\'clock.' }
    }
  },
  {
    id: 'lrn_7',
    name: 'Sofia',
    classId: 'rec_a',
    ageBand: '4–5 years',
    languageBackground: 'EAL / Bilingual (English & Spanish)',
    groupId: 'grp_blend',
    currentFocus: 'Oral blending and vocabulary in stories',
    focusRationale: 'Enjoys shared book reading; practising short vowel sound distinctions.',
    createdDate: '2026-09-18T08:00:00Z',
    observations: {
      'ol_2': { skillId: 'ol_2', skillName: 'Descriptive object vocabulary', strandId: 'oral_language', status: 'independent', date: '2026-10-20' },
      'pa_1': { skillId: 'pa_1', skillName: 'Rhyme recognition', strandId: 'phonological_awareness', status: 'independent', date: '2026-10-24' },
      'pm_1': { skillId: 'pm_1', skillName: 'Oral blending (2–3 phonemes)', strandId: 'phonemic_awareness', status: 'developing', date: '2026-10-29' }
    }
  },
  {
    id: 'lrn_8',
    name: 'Liam',
    classId: 'rec_a',
    ageBand: '4–5 years',
    languageBackground: 'English (Home language)',
    groupId: 'grp_letters',
    currentFocus: 'Set 1 sounds and initial letter formation',
    focusRationale: 'Making steady progress across all introductory sound activities.',
    createdDate: '2026-09-18T08:00:00Z',
    observations: {
      'pa_2': { skillId: 'pa_2', skillName: 'Syllable clapping & count', strandId: 'phonological_awareness', status: 'independent', date: '2026-10-22' },
      'ph_1': { skillId: 'ph_1', skillName: 'Set 1 Correspondences: s, a, t, p', strandId: 'phonics_decoding', status: 'developing', date: '2026-10-30', note: 'Recognises s and a.' }
    }
  }
];

export const INITIAL_SAVED_PLANS = [
  {
    id: 'plan_1',
    title: 'Oral Blending with Previously Taught Sounds',
    targetType: 'group' as const,
    targetId: 'grp_blend',
    strandId: 'phonemic_awareness' as const,
    durationMinutes: 10,
    activityId: 'act_1',
    learningIntention: 'Blend spoken pure phonemes (/s/, /a/, /t/, /p/) to identify objects in the mystery bag without visual cues.',
    prerequisites: ['Alliteration and initial sound awareness'],
    preparation: 'Simphonics Mystery Pouch with 4 small items (sun, cup, pen, pin). Book 1, p. 8.',
    bookReference: 'Simphonics Activity Book 1: Sound Play, p. 8',
    model: 'Hold pouch. Say: "Inside my pouch is a /c/ ... /u/ ... /p/. Can you blend the sounds to guess?" Sweep hand.',
    guidedPractice: 'Say: "/s/ ... /u/ ... /n/. Let\'s say the sounds together, faster and faster until we hear \'sun\'!"',
    independentAttempt: 'Teacher says: "/p/ ... /i/ ... /n/". Learners blend independently without teacher hand motions.',
    check: 'Record whether learner blends independently on 1st try or needs sound gap shortened.',
    adaptation: {
      extraSupport: 'Compress the time gap between phonemes to 0.5s or tap fingers sequentially.',
      extension: 'Invite a learner to select a mystery object and segment the sounds for peers.'
    },
    status: 'in_progress' as const,
    currentStepIndex: 1,
    lastUpdated: '2026-11-02T14:30:00Z'
  }
];
