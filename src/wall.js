import Pawn from "./pawn.js";

class Wall extends Pawn {
  constructor(board, x, y) {
    super(board, "/assets/wall.glb", x, y);
    this.name = "Wall";
    this.description = "Can't take any damage";
  }

  takeDamage(_amount) {}

  isDead() {
    return false;
  }
}

export default Wall;
