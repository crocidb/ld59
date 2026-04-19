import Pawn from "./pawn.js";

const ORIENTATIONS = [
  { rotY: 0 },
  { rotY: 3 * Math.PI / 2 },
  { rotY: Math.PI },
  { rotY: Math.PI / 2 },
];

class Wall extends Pawn {
  constructor(board, x, y, orientation = 0) {
    super(board, "assets/wall.glb", x, y);
    this.name = "Wall";
    this.description = "Can't take any damage";
    this.orientation = orientation;
    this._rotationApplied = false;
  }

  takeDamage(_amount) {}

  isDead() {
    return false;
  }

  _update() {
    if (!this._rotationApplied && this.mesh) {
      this.mesh.rotation.y = ORIENTATIONS[this.orientation].rotY;
      this._rotationApplied = true;
    }
  }
}

export default Wall;
