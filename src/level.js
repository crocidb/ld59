const LEVEL_DATA = [
  {
    name: "Level 0 - Tutorial",
    description:
      "Welcome to <b>Remote Tactical Wars</b>! <br><br>You should destroy your enemy's <b>Stronghold</b>. The canons cannot decide what to do, so they'll do what the commands they receive from the emmiter pieces. But they can receive one signal at a time. <b>Click</b> on your canon to set what signals it can receive.<br><br>Your enemies will also receive your signals, but you can't decide which signals they do.",
    board: { width: 5, height: 6 },
    canons: [{ x: 2, y: 2, receiver: 0 }],
    emitters: [{ x: 2, y: 0, type: 1, rate: 2.2 }],
    enemyCanons: [],
    stronghold: { x: 2, y: 5 },
  },
  {
    name: "Level 1",
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
    name: "Level 2",
    description:
      "You have to move now",
    board: { width: 5, height: 12 },
    canons: [
      { x: 1, y: 3, receiver: 0, orientation: 0 },
      { x: 2, y: 3, receiver: 0, orientation: 0 },
      { x: 3, y: 3, receiver: 0, orientation: 0 },
    ],
    emitters: [
      { x: 1, y: 0, type: 1, rate: 1.8 },
      { x: 2, y: 0, type: 3, rate: 6.0 },
      { x: 3, y: 0, type: 2, rate: 3.0 },
    ],
    enemyCanons: [
      { x: 1, y: 9, receiver: 0, orientation: 2 },
      { x: 2, y: 9, receiver: 1, orientation: 2 },
      { x: 3, y: 9, receiver: 0, orientation: 2 },
    ],
    stronghold: { x: 2, y: 11 },
  },
];

export default LEVEL_DATA;
