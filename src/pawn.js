import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const SIGNAL_LABELS = ["Disabled", "Shoot", "Move", "Rotate"];
export const SIGNAL_COLORS = [0x888888, 0x55ddff, 0x55ffaa, 0xff7799];
export const SIGNAL_SPRITE_SRCS = [
  "/assets/sprites/split-cross.png",
  "/assets/sprites/cannon-shot.png",
  "/assets/sprites/move.png",
  "/assets/sprites/cycle.png",
];
export const SIGNAL_BG_COLORS = [
  "rgba(40, 40, 40, 0.9)",
  "rgba(50, 100, 155, 0.9)",
  "rgba(50, 140, 90, 0.9)",
  "rgba(155, 70, 85, 0.9)",
];
export const signalImages = SIGNAL_SPRITE_SRCS.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

class Pawn {
  constructor(board, modelPath, x, y) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.name = "";
    this.description = "";
    this.mesh = null;
    this.maxLife = 0;
    this.life = 0;

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      this.mesh = gltf.scene;
      this.mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.mesh.scale.set(0.6, 0.6, 0.6);
      this._applyPosition();
      board.board.add(this.mesh);
    });
  }

  _applyPosition() {
    const offsetX = (this.board.width - 1) / 2;
    const offsetY = (this.board.height - 1) / 2;
    this.mesh.position.set((this.board.width - 1 - this.x) - offsetX, 0, this.y - offsetY);
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    if (this.mesh) this._applyPosition();
  }

  iscoordinate(coord) {
    return coord.x == this.x && coord.y == this.y;
  }

  takeDamage(amount) {
    this.life = Math.max(0, this.life - amount);
    if (this._redrawSpriteCanvas) this._redrawSpriteCanvas();
  }

  isDead() {
    return this.maxLife > 0 && this.life <= 0;
  }

  action() {

  }

  _update() {

  }

  update() {
    this._update();
  }
}

export default Pawn;
