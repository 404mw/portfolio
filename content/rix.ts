// The /rix page copy: the Rix playground (constitution §2). No claims, so no facts source.
// Voice: docs/04-voice.md. Slots: docs/pages/rix/ui-spec.md §0.6 and ui-spec/01–03.
// Rix's own lines (poke, annoyed, angry, sulk, forgive, pet) and his buttonLabel stay in
// content/home.ts → about.rix. The Book a call label is content/shared.ts → nav.bookCall.

export const meta = {
  title: "Play with Rix, the MARWIX mascot",
  description:
    "Press a button and Rix, the MARWIX mascot on marwix.dev, acts it out: a mood, a move or a trick. Poke him or pet him and see what he does.",
  ogAlt:
    "Rix, the violet MW mascot, standing on a line beside the MARWIX wordmark and the words Play with Rix.",
} as const;

export const intro = {
  heading: { lead: "Play with", accent: "Rix" },
  line: "Press a button and Rix acts it out. Poke or pet him.",
} as const;

export const playground = {
  heading: "Make Rix act",
  groups: {
    emotions: "Emotions",
    moves: "Moves",
    plays: "Tricks",
    moods: "Moods",
    glyphs: "Symbols",
  },
  emotions: {
    happy: "Happy",
    excited: "Excited",
    curious: "Curious",
    shy: "Shy",
    surprised: "Surprised",
    confused: "Confused",
    sleepy: "Sleepy",
    sad: "Sad",
    annoyed: "Annoyed",
    angry: "Angry",
    love: "Love",
  },
  moves: {
    walkLeft: "Walk left",
    walkCentre: "Walk to centre",
    walkRight: "Walk right",
    talk: "Talk",
    perk: "Perk up",
    wave: "Wave",
    pick: "Pick a prop",
    pet: "Pet",
    arrive: "Make an entrance",
  },
  plays: {
    juggle: "Juggle",
    juggleDrop: "Juggle and drop",
    sit: "Sit",
    nap: "Nap",
    wake: "Wake up",
    tagDodge: "Dodge the tag",
    tagDuck: "Duck the tag",
    peekaboo: "Peek-a-boo",
    logoPose: "Logo pose",
    balance: "Balance a prop",
  },
  moods: {
    poke: "Happy poke",
    annoyed: "Annoyed poke",
    tantrum: "Throw a tantrum",
    tantrumPick: "Tantrum, toss prop",
    sulk: "Sulk",
    forgive: "Forgive",
    calm: "Calm with prop",
  },
  glyphs: {
    alert: "Alert",
    question: "Question",
    heart: "One heart",
    hearts: "Rising hearts",
    burst: "Heart burst",
    sparkle: "Sparkle",
    drop: "Sweat drop",
    dots: "Thinking dots",
    vein: "Anger vein",
    grawlix: "Swear marks",
    zzz: "Zzz",
  },
  nowPlaying: "Now playing",
  idle: "Idle",
  patrolToggle: "Let him wander",
  talkSample: "Hi there! I talk with my eyes.",
  reducedNote:
    "Your device asks for less motion, so he keeps still. Talk, props and moods still work.",
  noScript: "Turn on JavaScript to make Rix act.",
} as const;

export const wayBack = {
  heading: { lead: "Done playing?", accent: "Let's talk." },
  home: "Back to home",
} as const;
