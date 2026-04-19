const LEVEL_DATA = [
  {
    name: "Tutorial",
    description:
      "Welcome to <b>Remote Tactical Wars</b>! <br><br>You should destroy your enemy's <b>Stronghold</b>. The canons cannot decide what to do, so they'll do what the commands they receive from the emmiter pieces. But they can receive one signal at a time. <b>Click</b> on your canon to set what signals it can receive.<br><br>Your enemies will also receive your signals, but you can't decide which signals they do.",
    board: { width: 5, height: 6 },
    canons: [{ x: 2, y: 2, receiver: 0 }],
    emitters: [{ x: 2, y: 0, type: 1, rate: 2.2 }],
    enemyCanons: [],
    stronghold: { x: 2, y: 5 },
  },
  {
    name: "Friendly Fire",
    description:
      "Be careful with friendly fire. Turn to your target and shoot.",
    board: { width: 3, height: 8 },
    canons: [{ x: 2, y: 0, receiver: 0, orientation: 3 }],
    emitters: [
      { x: 1, y: 0, type: 1, rate: 2.2 },
      { x: 0, y: 0, type: 3, rate: 6.0 },
    ],
    enemyCanons: [{ x: 0, y: 7, receiver: 1, orientation: 2 }],
    stronghold: { x: 2, y: 7 },
  },
  {
    name: "The Wall",
    description:
      "The walls won't take any damage, so you'll have to move around it.",
    board: { width: 5, height: 7 },
    canons: [{ x: 2, y: 1, receiver: 0, orientation: 0 }],
    emitters: [
      { x: 1, y: 0, type: 1, rate: 1.8 },
      { x: 2, y: 0, type: 3, rate: 3.0 },
      { x: 3, y: 0, type: 2, rate: 2.0 },
    ],
    enemyCanons: [], walls: [ { x: 1, y: 4, orientation: 2 }, { x: 2, y: 4, orientation: 2 }, { x: 3, y: 4, orientation: 2 }, ],
    stronghold: { x: 2, y: 6 },
  },
  {
    name: "Corridor of Death",
    description:
      "You'll have to go through it.",
    board: { width: 7, height: 9 },
    canons: [
      { x: 2, y: 1, receiver: 0, orientation: 0 },
      { x: 3, y: 1, receiver: 0, orientation: 0 },
      { x: 4, y: 1, receiver: 0, orientation: 0 },
    ],
    emitters: [
      { x: 0, y: 0, type: 3, rate: 3.8 },
      { x: 3, y: 0, type: 1, rate: 2.8 },
      { x: 6, y: 0, type: 2, rate: 3.8 },
    ],
    enemyCanons: [
      { x: 0, y: 3, receiver: 1, orientation: 1 },
      { x: 0, y: 4, receiver: 1, orientation: 1 },
      { x: 0, y: 5, receiver: 1, orientation: 1 },
      { x: 0, y: 6, receiver: 1, orientation: 1 },
      { x: 6, y: 3, receiver: 1, orientation: 3 },
      { x: 6, y: 4, receiver: 1, orientation: 3 },
      { x: 6, y: 5, receiver: 1, orientation: 3 },
      { x: 6, y: 6, receiver: 1, orientation: 3 },
    ],
    walls: [
      { x: 2, y: 4, orientation: 2 },
      { x: 3, y: 3, orientation: 2 },
      { x: 3, y: 5, orientation: 2 },
      { x: 3, y: 5, orientation: 2 },
      { x: 3, y: 6, orientation: 2 },
      { x: 4, y: 4, orientation: 2 },
    ],
    stronghold: { x: 3, y: 8 },
  },
  {
    name: "Too Many Signals",
    description:
      "Too many signals in the world. Be careful what you receive.",
    board: { width: 6, height: 6 },
    canons: [
      { x: 3, y: 0, receiver: 0, orientation: 0 },
    ],
    emitters: [
      { x: 0, y: 0, type: 1, rate: 1.8 },
      { x: 1, y: 0, type: 1, rate: 1.8 },
      { x: 2, y: 0, type: 1, rate: 1.8 },
      { x: 4, y: 0, type: 2, rate: 3.8 },
      { x: 5, y: 0, type: 3, rate: 3.8 },
    ],
    enemyCanons: [
      { x: 5, y: 2, receiver: 1, orientation: 3 },
      { x: 5, y: 3, receiver: 1, orientation: 3 },
    ],
    walls: [
      { x: 0, y: 4, orientation: 2 },
      { x: 1, y: 4, orientation: 2 },
      { x: 5, y: 1, orientation: 1 },
    ],
    stronghold: { x: 0, y: 5 },
  },
  {
    name: "Emitters Are Neutral",
    description:
      "Can you do it with only one <b>Canon</b>?",
    board: { width: 9, height: 6 },
    canons: [
      { x: 4, y: 5, receiver: 0, orientation: 2 },
    ],
    emitters: [
      { x: 3, y: 0, type: 2, rate: 4.0 },
      { x: 5, y: 0, type: 3, rate: 4.0 },
      { x: 4, y: 1, type: 1, rate: 3.8 },
      { x: 0, y: 1, type: 1, rate: 3.0 },
      { x: 8, y: 1, type: 1, rate: 3.0 },
      { x: 0, y: 5, type: 1, rate: 3.5 },
      { x: 8, y: 5, type: 1, rate: 3.5 },
    ],
    enemyCanons: [
      { x: 1, y: 0, receiver: 1, orientation: 0 },
      { x: 2, y: 0, receiver: 1, orientation: 0 },
      { x: 6, y: 0, receiver: 1, orientation: 0 },
      { x: 7, y: 0, receiver: 1, orientation: 0 },
    ],
    walls: [
      { x: 1, y: 3, orientation: 0 },
      { x: 2, y: 3, orientation: 0 },
      { x: 3, y: 3, orientation: 0 },
      { x: 4, y: 3, orientation: 0 },
      { x: 5, y: 3, orientation: 0 },
      { x: 6, y: 3, orientation: 0 },
      { x: 7, y: 3, orientation: 0 },
      { x: 0, y: 0, orientation: 0 },
      { x: 8, y: 0, orientation: 0 },
    ],
    stronghold: { x: 4, y: 0 },
  },
  {
    name: "Brute Force",
    description:
      "A long journey towards your goal. Face it.",
    board: { width: 9, height: 5 },
    canons: [
      { x: 3, y: 0, receiver: 0, orientation: 3 },
      { x: 3, y: 1, receiver: 0, orientation: 3 },
      { x: 3, y: 3, receiver: 0, orientation: 3 },
      { x: 3, y: 4, receiver: 0, orientation: 3 },
    ],
    emitters: [
      { x: 0, y: 0, type: 1, rate: 4.5 },
      { x: 0, y: 2, type: 1, rate: 4.5 },
      { x: 0, y: 4, type: 1, rate: 4.5 },
      { x: 0, y: 1, type: 2, rate: 2.0 },
      { x: 0, y: 3, type: 3, rate: 2.0 },
    ],
    enemyCanons: [
      { x: 5, y: 2, receiver: 1, orientation: 3 },
      { x: 8, y: 4, receiver: 1, orientation: 3 },
      { x: 8, y: 0, receiver: 1, orientation: 3 },
    ],
    walls: [
      { x: 4, y: 4, orientation: 1 },
      { x: 4, y: 3, orientation: 1 },
      { x: 4, y: 1, orientation: 1 },
      { x: 4, y: 0, orientation: 1 },
      { x: 1, y: 2, orientation: 1 },
      { x: 7, y: 3, orientation: 1 },
      { x: 7, y: 2, orientation: 1 },
      { x: 7, y: 1, orientation: 1 },
    ],
    stronghold: { x: 8, y: 2 },
  },
];

export default LEVEL_DATA;
