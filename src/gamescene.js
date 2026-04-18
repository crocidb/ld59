import * as THREE from "three";
import Input from "./input.js";
import ParticleSystem from "./particles.js";
import Board from "./board.js";
import Emitter from "./emitter.js";
import Canon from "./canon.js";
import LEVEL_DATA from "./level.js";

class GameScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    ParticleSystem.instance.init(this.scene);

    this.currentLevel = LEVEL_DATA[0];
    this.currentSelected = null;

    // HUD
    this.hudSelectionTitle = document.querySelector("#hud_selection h1");

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    this.camera.lookAt(0, 0, 0);

    // LIGHT
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(this.ambientLight);

    this.sun = new THREE.DirectionalLight(0xffffff, 1.0);
    this.sun.position.set(6, 10, 4);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -8;
    this.sun.shadow.camera.right = 8;
    this.sun.shadow.camera.top = 8;
    this.sun.shadow.camera.bottom = -8;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 30;
    this.sun.shadow.bias = -0.0005;

    this.scene.add(this.sun);

    // BOARD
    this.board = new Board(
      this.currentLevel.board.width,
      this.currentLevel.board.height,
    );
    this.scene.add(this.board.board);

    this._fitCameraToBoard(
      this.currentLevel.board.width,
      this.currentLevel.board.height,
    );

    this.pawns = [];
    this.pawns.push(new Emitter(this.scene, this.board, 0, 0));
    this.pawns.push(new Canon(this.board, 2, 5));

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-9999, -9999);

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    window.addEventListener("click", this._click.bind(this));
  }

  _fitCameraToBoard(boardWidth, boardHeight) {
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
    const halfCamZ = boardHeight / (2 * Math.SQRT2);
    const distForWidth =
      boardWidth / 2 / Math.tan(hFov / 2) + halfCamZ * Math.SQRT2;
    const distForDepth = halfCamZ / Math.tan(vFov / 2) + halfCamZ * Math.SQRT2;
    const D = Math.max(distForWidth, distForDepth) * 1.1;
    this.camera.position.set(0, D / Math.SQRT2, -D / Math.SQRT2);
    this.camera.lookAt(0, 0, 0);
  }

  _click(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.currentSelected) {
      this.currentSelected.fire();
    }
  }

  update() {
    if (Input.instance.iskeydown(Input.SPACE)) {
      ParticleSystem.instance.burst(new THREE.Vector3(0, 0, 0), 250, 1.2, 1.0);
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.board.update(this.raycaster);

    for (let p of this.pawns) {
      p.update();
    }

    this.updateInput();
    this.updateHud();
  }

  updateInput() {
    this.currentSelected = null;
    if (this.board.currentSelected != null) {
      for (let p of this.pawns) {
        if (p.iscoordinate(this.board.currentSelected)) {
          this.currentSelected = p;
          break;
        }
      }
    }
  }

  updateHud() {
    this.hudSelectionTitle.innerHTML = "Empty Square";
    if (this.currentSelected != null) {
      this.hudSelectionTitle.innerHTML = this.currentSelected.name;
    }
  }
}

export default GameScene;
