import * as THREE from "three";
import System from "./system.js";
import Input from "./input.js";
import ParticleSystem from "./particles.js";
import Board from "./board.js";
import Emitter from "./emitter.js";
import Canon from "./canon.js";
import EnemyCanon from "./enemycanon.js";
import Bullet from "./bullet.js";
import LEVEL_DATA from "./level.js";
import Time from "./time.js";

class GameScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    ParticleSystem.instance.init(this.scene);

    this.currentLevel = LEVEL_DATA[0];
    this.currentSelected = null;
    this.paused = false;
    this._helpVisible = false;

    // HUD
    this.hudLevelTitle = document.querySelector("#hud_level_title h1");
    this.hudSelectionTitle = document.querySelector("#hud_selection h1");
    this.hudSelectionDescription = document.querySelector("#hud_selection p");
    this._btnPlayPause = document.getElementById("btn_playpause");
    this._btnHelp = document.getElementById("btn_help");
    this._hudHelp = document.getElementById("hud_help");
    this._hud = document.getElementById("hud");
    this._helpTitle = document.querySelector("#hud_help h2");
    this._helpDescription = document.querySelector("#hud_help > p");

    this.hudLevelTitle.innerHTML = this.currentLevel.name;
    this._helpTitle.innerHTML = this.currentLevel.name;
    this._helpDescription.innerHTML = this.currentLevel.description;
    this._hud.hidden = false;
    this._setupControls();

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(
      40,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    this.camera.lookAt(0, 0, 0);
    this._cameraBasePosition = new THREE.Vector3();
    this._shakeIntensity = 0;
    this._shakeDuration = 0;

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
    for (const e of this.currentLevel.emitters) {
      this.pawns.push(new Emitter(this.scene, this.board, e.x, e.y, e.type, e.rate, this.camera));
    }
    for (const c of this.currentLevel.canons) {
      this.pawns.push(new Canon(this.scene, this.board, c.x, c.y, this.camera, c.receiver ?? 1));
    }
    for (const c of (this.currentLevel.enemyCanons ?? [])) {
      this.pawns.push(new EnemyCanon(this.scene, this.board, c.x, c.y, this.camera, c.receiver ?? 1, c.orientation ?? 2));
    }

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-9999, -9999);
    this._pawnWorldPos = new THREE.Vector3();

    this._toggleHelp();

    this._onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    this._onClick = this._click.bind(this);
    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("click", this._onClick);
  }

  resize(w, h) {
    for (const p of this.pawns) {
      if (p.rings) {
        for (const ring of p.rings) ring.resize(w, h);
      }
    }
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
    this._cameraBasePosition.copy(this.camera.position);
    this.camera.lookAt(0, 0, 0);
  }

  shakeCamera(intensity, duration) {
    this._shakeIntensity = intensity;
    this._shakeDuration = duration;
  }

  _updateShake() {
    const dt = Time.instance.dt();

    this._shakeDuration = THREE.MathUtils.lerp(this._shakeDuration, 0, 8 * dt);

    if (this._shakeDuration < 0.01) {
      this._shakeIntensity = THREE.MathUtils.lerp(this._shakeIntensity, 0, 10 * dt);
    }

    if (this._shakeIntensity > 0.001) {
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();

      const ox = (Math.random() * 2 - 1) * this._shakeIntensity;
      const oy = (Math.random() * 2 - 1) * this._shakeIntensity;

      this.camera.position
        .copy(this._cameraBasePosition)
        .addScaledVector(right, ox)
        .addScaledVector(up, oy);
    } else {
      this.camera.position.copy(this._cameraBasePosition);
    }
  }

  _setupControls() {
    this._onPlayPause = () => this._togglePause();
    this._onRestart = () => System.instance.setScene(() => new GameScene(this.canvas));
    this._onHelp = () => this._toggleHelp();

    this._btnPlayPause.addEventListener("click", this._onPlayPause);
    document.getElementById("btn_restart").addEventListener("click", this._onRestart);
    this._btnHelp.addEventListener("click", this._onHelp);
  }

  exit() {
    this._btnPlayPause.removeEventListener("click", this._onPlayPause);
    document.getElementById("btn_restart").removeEventListener("click", this._onRestart);
    this._btnHelp.removeEventListener("click", this._onHelp);
    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("click", this._onClick);

    this._hud.hidden = true;

    if (this.paused) Time.instance.timeScale = 1;

    Bullet.pool.length = 0;

    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
  }

  _togglePause() {
    this.paused = !this.paused;
    Time.instance.timeScale = this.paused ? 0 : 1;
    const img = this._btnPlayPause.querySelector("img");
    img.src = this.paused ? "assets/sprites/play-button.svg" : "assets/sprites/pause-button.svg";
    img.alt = this.paused ? "Play" : "Pause";
    this._btnPlayPause.title = this.paused ? "Play" : "Pause";
  }

  _toggleHelp() {
    this._helpVisible = !this._helpVisible;
    this._hudHelp.classList.toggle("hidden", !this._helpVisible);
    if (this._helpVisible && !this.paused) this._togglePause();
    else if (!this._helpVisible && this.paused) this._togglePause();
  }

  _click(e) {
    // const rect = this.canvas.getBoundingClientRect();
    // const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    // const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.currentSelected) {
      this.currentSelected.action();
    }
  }

  update() {
    this._updateShake();

    if (Input.instance.iskeydown(Input.SPACE)) {
      ParticleSystem.instance.burst(new THREE.Vector3(0, 0, 0), 250, 1.2, 1.0);
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.board.update(this.raycaster);

    for (let p of this.pawns) {
      p.update();
    }

    const emitters = this.pawns.filter(p => p instanceof Emitter);
    const canons = this.pawns.filter(p => p instanceof Canon);
    for (const emitter of emitters) {
      for (const ring of emitter.rings) {
        if (!ring.active) continue;
        for (const canon of canons) {
          if (!canon.mesh) continue;
          if (ring.triggered.has(canon)) continue;
          const dx = ring.origin.x - canon.mesh.position.x;
          const dz = ring.origin.z - canon.mesh.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (ring.radius >= dist) {
            ring.triggered.add(canon);
            if (canon.receiverType === emitter.type) {
              if (emitter.type === 1) {
                canon.fire();
              } else if (emitter.type === 2) {
                canon.move(this.pawns);
              } else if (emitter.type === 3) {
                canon.rotate();
              }
            }
          }
        }
      }
    }

    Bullet.updateAll(this.scene);

    for (const bullet of Bullet.pool) {
      if (!bullet.active) continue;
      for (const pawn of this.pawns) {
        if (!pawn.mesh) continue;
        if (bullet.owner === pawn) continue;
        pawn.mesh.getWorldPosition(this._pawnWorldPos);
        const dx = bullet.position.x - this._pawnWorldPos.x;
        const dz = bullet.position.z - this._pawnWorldPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < bullet.radius + 0.4) {
          bullet.active = false;
          this.scene.remove(bullet.mesh);
          pawn.takeDamage(1);
          this.shakeCamera(0.1, 0.01);
          ParticleSystem.instance.burst(bullet.position.clone(), 50, 4.5, 0.07, 0xff4400);
        }
      }
    }

    for (let i = this.pawns.length - 1; i >= 0; i--) {
      const pawn = this.pawns[i];
      if (pawn.isDead()) {
        if (pawn.mesh) {
          ParticleSystem.instance.burst(pawn.mesh.position.clone(), 180, 2.0, .1, 0xff6600);
          this.shakeCamera(0.3, 0.1);
          pawn.mesh.removeFromParent();
        }
        this.pawns.splice(i, 1);
      }
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
    this.hudSelectionDescription.innerHTML = "";
    if (this.currentSelected != null) {
      this.hudSelectionTitle.innerHTML = this.currentSelected.name;
      this.hudSelectionDescription.innerHTML = this.currentSelected.description;
    }
  }
}

export default GameScene;
