import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import CRTShader from './crtshader.js';

import GameScene from "./gamescene.js"
import Time from "./time.js"
import Input from "./input.js"
import ParticleSystem from "./particles.js"

class System {
  constructor() {
    System.instance = this;
    Input.instance.update();

    this.div = document.getElementById("gamediv");

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.div.appendChild(this.renderer.domElement);
    this.resize();

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    const w = this.div.clientWidth;
    const h = this.div.clientHeight;
    this.renderer.setSize(w, h, true);
    if (this.currentScene && this.currentScene.camera) {
      this.currentScene.camera.aspect = w / h;
      this.currentScene.camera.updateProjectionMatrix();
    }
    if (this.composer) this.composer.setSize(w, h);
    if (this.crtPass) this.crtPass.uniforms.resolution.value.set(w, h);
    if (this.currentScene && this.currentScene.resize) this.currentScene.resize(w, h);
  }

  start() {
    this.currentScene = new GameScene(this.renderer.domElement, 0);
    this.resize();

    const { scene, camera } = this.currentScene;
    const { clientWidth: w, clientHeight: h } = this.div;

    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.15, 0.2, 0.3);
    this.crtPass = new ShaderPass(CRTShader);
    this.crtPass.uniforms.resolution.value.set(w, h);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(new SMAAPass(w, h));
    this.composer.addPass(bloomPass);
    this.composer.addPass(this.crtPass);
    this.composer.addPass(new OutputPass());

    this.update();
  }

  setScene(sceneFactory) {
    if (this.currentScene?.exit) this.currentScene.exit();
    const scene = sceneFactory();
    this.currentScene = scene;
    this.composer.passes[0] = new RenderPass(scene.scene, scene.camera);
    this.resize();
  }

  update() {
    Time.instance.update();
    ParticleSystem.instance.update();

    this.currentScene.update();

    this.crtPass.uniforms.time.value = Time.instance.total;
    this.composer.render();
    requestAnimationFrame(this.update.bind(this));
    Input.instance.update();
  }
}

export default System;
