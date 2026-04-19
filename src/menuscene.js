import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import System from "./system.js";
import GameScene from "./gamescene.js";
import MusicManager from "./music.js";
import Time from "./time.js";

class MenuScene {
  constructor(canvas) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a12);
    this.scene.fog = new THREE.Fog(0x0a0a12, 8, 20);

    this.camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
    this._cameraAngle = 0;
    this._cameraRadius = 4.5;
    this._cameraHeight = 4.0;

    this._buildBoard();
    this._loadStronghold();
    this._setupLights();

    this._onGateClick = this._onGateClick.bind(this);
    this._onStartClick = this._onStartClick.bind(this);

    this._menuDiv = document.getElementById('menu');
    this._gateEl = document.getElementById('menu_gate');
    this._panelEl = document.getElementById('menu_panel');
    this._bottomEl = document.getElementById('menu_bottom');

    document.getElementById('btn_menu_gate').addEventListener('click', this._onGateClick);
    document.getElementById('btn_start_game').addEventListener('click', this._onStartClick);

    this._menuDiv.removeAttribute('hidden');

    if (MusicManager.instance.isInitialized) {
      this._gateEl.classList.add('hidden');
      this._panelEl.classList.remove('hidden');
      MusicManager.instance.play();
    }
  }

  _buildBoard() {
    const squareGeo = new THREE.BoxGeometry(1, 0.1, 1);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xeeeed2, roughness: 0.8 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x769656, roughness: 0.8 });

    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        const mat = (x + z) % 2 === 0 ? lightMat : darkMat;
        const mesh = new THREE.Mesh(squareGeo, mat);
        mesh.position.set(x - 1, -0.05, z - 1);
        mesh.receiveShadow = true;
        this.scene.add(mesh);
      }
    }
  }

  _loadStronghold() {
    const loader = new GLTFLoader();
    loader.load('assets/stronghold.glb', (gltf) => {
      this._stronghold = gltf.scene;
      this._stronghold.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this._stronghold.scale.set(0.6, 0.6, 0.6);
      this._stronghold.position.set(0, 0, 0);
      this.scene.add(this._stronghold);
    });
  }

  _setupLights() {
    const ambient = new THREE.AmbientLight(0x334466, 1.5);
    this.scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffeedd, 2.0);
    dir.position.set(4, 6, 3);
    dir.castShadow = true;
    this.scene.add(dir);

    const fill = new THREE.PointLight(0x4466ff, 1.2, 10);
    fill.position.set(-3, 2, -2);
    this.scene.add(fill);
  }

  _onGateClick() {
    MusicManager.instance.init();
    this._gateEl.classList.add('hidden');
    this._panelEl.classList.remove('hidden');
    this._bottomEl.classList.remove('hidden');
  }

  _onStartClick() {
    const savedLevel = parseInt((() => { try { return localStorage.getItem("currentLevel"); } catch(e) { return null; } })() ?? "0", 10);
    const startLevel = isNaN(savedLevel) ? 0 : savedLevel;
    System.instance.setScene(() => new GameScene(System.instance.renderer.domElement, startLevel));
  }

  update() {
    this._cameraAngle += Time.instance.dt() * 0.4;
    const x = Math.cos(this._cameraAngle) * this._cameraRadius;
    const z = Math.sin(this._cameraAngle) * this._cameraRadius;
    this.camera.position.set(x, this._cameraHeight, z);
    this.camera.lookAt(0, 0.3, 0);
  }

  resize(w, h) {
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  exit() {
    document.getElementById('btn_menu_gate').removeEventListener('click', this._onGateClick);
    document.getElementById('btn_start_game').removeEventListener('click', this._onStartClick);
    this._menuDiv.setAttribute('hidden', '');
  }
}

export default MenuScene;
