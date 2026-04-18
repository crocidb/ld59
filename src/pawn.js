import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class Pawn {
  constructor(board, modelPath, x, y) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.name = "";
    this.mesh = null;

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
    this.mesh.position.set((this.board.width - 1 - this.x) - offsetX, 0.6, this.y - offsetY);
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    if (this.mesh) this._applyPosition();
  }

  iscoordinate(coord) {
    return coord.x == this.x && coord.y == this.y;
  }
}

export default Pawn;
