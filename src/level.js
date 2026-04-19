const LEVEL_DATA = [
  {
    name: "Level 0 - Tutorial",
    description: "Welcome to this game! Your canons always start without any signal receiver. Click on it to switch between the available receivers. Match the one that's in this level and you'll see action. <br><br>You can't control what receibers your enemies will have, but their canons will also respond to your signal emiters.",
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
  }
];

export default LEVEL_DATA;
