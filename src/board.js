import * as THREE from "three";

class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = new THREE.Group();
    this.squares = [];
    this.currentSelected = null;

    this.offset = {
      x: (width - 1) / 2,
      z: (height - 1) / 2,
    };
    const offset = this.offset;
    const squareGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeed2,
      roughness: 0.8,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x769656,
      roughness: 0.8,
    });

    for (let x = 0; x < width; x++) {
      for (let z = 0; z < height; z++) {
        const mat = (x + z) % 2 == 0 ? lightMaterial : darkMaterial;
        const mesh = new THREE.Mesh(squareGeometry, mat);
        mesh.position.set(x - offset.x, -0.05, z - offset.z);
        mesh.receiveShadow = true;
        this.board.add(mesh);
        this.squares.push(mesh);
      }
    }

    const hoverGeo = new THREE.BoxGeometry(1.0, 0.01, 1.0);
    const hoverMat = new THREE.MeshBasicMaterial({
      color: 0xff9999,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    this.hoverIndicator = new THREE.Mesh(hoverGeo, hoverMat);
    this.hoverIndicator.visible = false;
    this.hoverIndicator.position.y = 0.005;
    this.board.add(this.hoverIndicator);
  }

  update(raycaster) {
    const hits = raycaster.intersectObjects(this.squares);
    this.setHovered(hits.length > 0 ? hits[0].object : null);
  }

  setHovered(square) {
    if (square) {
      this.hoverIndicator.visible = true;
      this.hoverIndicator.position.x = square.position.x;
      this.hoverIndicator.position.z = square.position.z;
      this.currentSelected = {
        x: (this.width - 1) - Math.round(square.position.x + this.offset.x),
        y: Math.round(square.position.z + this.offset.z),
      };
    } else {
      this.hoverIndicator.visible = false;
      this.currentSelected = null;
    }
  }
}

export default Board;
