const LEVEL_DATA = [
  {
    name: "Level 0 - Tutorial",
    board: {width: 5, height: 10},
    canons: [
      {x: 1, y: 4, receiver: 0},
      {x: 3, y: 4, receiver: 0},
      {x: 2, y: 2, receiver: 0},
    ],
    enemyCanons: [
      { x: 2, y: 7, receiver: 1, orientation: 2 },
    ],
    emitters: [
      { x: 1, y: 0, type: 1, rate: 1.5 },
      { x: 2, y: 0, type: 2, rate: 2.5 },
      { x: 3, y: 0, type: 3, rate: 3.5 },
    ]
  }
];

export default LEVEL_DATA;
