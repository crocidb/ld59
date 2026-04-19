import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Time from "./time.js";
import * as utils from "./utils.js";

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
    this.camera = null;
    this.sprite = null;
    this._spriteWorldPos = new THREE.Vector3();
    this._spriteScale = 0.06;
    this.flashIntensity = 0;
    this._flashColor = new THREE.Color(0xffffff);
    this._flashDecay = 9.0;

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
    this.flashIntensity = 1.5;
    this._flashColor.set(0xff2200);
    if (this.mesh) this.mesh.scale.y = 1.4;
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
    if (this.camera && this.sprite && this.mesh) {
      this.sprite.getWorldPosition(this._spriteWorldPos);
      const dist = this.camera.position.distanceTo(this._spriteWorldPos);
      this.sprite.scale.set(dist * this._spriteScale, dist * this._spriteScale * (84 / 64), 1);
    }
    if (this.mesh && this.flashIntensity > 0) {
      this.flashIntensity = utils.lerp(this.flashIntensity, 0, Time.instance.dt() * this._flashDecay);
      this.mesh.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.emissive = this._flashColor.clone().multiplyScalar(this.flashIntensity);
        }
      });
    }
  }
}

export default Pawn;
