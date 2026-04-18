import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


import Input from "./input.js";
import Time from "./time.js";
import ParticleSystem from "./particles.js";
import Board from "./board.js";
import LEVEL_DATA from "./level.js";

class GameScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    ParticleSystem.instance.init(this.scene);

    this.currentLevel = LEVEL_DATA[0];

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 8, -8);
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

    // Test object
    this.obj = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.MeshStandardMaterial({
        color: 0xc0392b,
        roughness: 0.4,
        metalness: 0.1,
      }),
    );
    this.obj.castShadow = true;
    this.obj.position.set(0, 0.5, 0);
    this.scene.add(this.obj);

    // Load emitter model
    const loader = new GLTFLoader();

    loader.load("/assets/emitter.glb", (gltf) => {
      this.emitter = gltf.scene;
      this.emitter.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.emitter.position.set(0, 1, 0);
      this.scene.add(this.emitter);
    });

      loader.load("/assets/canon.glb", (gltf) => {
      this.canon = gltf.scene;
      this.canon.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.canon.position.set(2, 1, 0);
      this.scene.add(this.canon);
    });


  }

  update() {
    this.obj.position.set(0, 0.5 + ((Math.sin(Time.instance.totalTime * 3.2) * .4) + 1.0) / 2, 0);

    if (Input.instance.iskeydown(Input.SPACE)) {
      ParticleSystem.instance.burst(this.obj.position, 80, 2.0, 1.0);
    }
  }
}

export default GameScene;
