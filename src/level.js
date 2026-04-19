const LEVEL_DATA = [
  {
    name: "Level 0 - Tutorial",
    description: "Welcome to <b>Remote Tactical Wars</b>! <br><br>You should destroy your enemies pieces. The canons cannot decide what to do, so they'll do what the commands they receive from the emmiter pieces. But they can receive one signal at a time. <b>Click</b> on your canon to set what signals it can receive.<br><br>Your enemies will also receive your signals, but you can't decide which signals they do.",
    board: {width: 5, height: 10},
    canons: [
      {x: 2, y: 2, receiver: 0},
    ],
    enemyCanons: [
      { x: 2, y: 7, receiver: 1, orientation: 2 },
    ],
    emitters: [
      { x: 2, y: 0, type: 1, rate: 2.2 },
    ]
  },
  {
    name: "Level 1",
    description: "Make sure you're pointing the enemy before shooting it!",
    board: {width: 3, height: 8},
    canons: [
      {x: 2, y: 0, receiver: 0, orientation: 3},
    ],
    enemyCanons: [
      { x: 2, y: 7, receiver: 1, orientation: 2 },
    ],
    emitters: [
      { x: 1, y: 0, type: 1, rate: 2.2 },
      { x: 0, y: 0, type: 3, rate: 6.0 },
    ]
  }
];

export default LEVEL_DATA;
