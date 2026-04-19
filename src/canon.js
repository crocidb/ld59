import * as THREE from "three";

import Pawn, { SIGNAL_LABELS, SIGNAL_COLORS, SIGNAL_BG_COLORS, signalImages } from "./pawn.js";
import Time from "./time.js";
import Bullet from "./bullet.js";
import ParticleSystem from "./particles.js"

import * as utils from "./utils.js";

const ORIENTATIONS = [
  { rotY: 0,              velocity: new THREE.Vector3(0, 0, 6),  burstOffset: new THREE.Vector3(0, 0,  0.6) },
  { rotY: 3 * Math.PI / 2, velocity: new THREE.Vector3(-6, 0, 0), burstOffset: new THREE.Vector3(-0.6, 0, 0) },
  { rotY: Math.PI,        velocity: new THREE.Vector3(0, 0, -6), burstOffset: new THREE.Vector3(0, 0, -0.6) },
  { rotY: Math.PI / 2,   velocity: new THREE.Vector3(6, 0, 0),  burstOffset: new THREE.Vector3( 0.6, 0, 0) },
];

class Canon extends Pawn {
  constructor(scene, board, x, z, camera, receiverType = 1, orientation = 0) {
    super(board, "/assets/canon.glb", x, z);
    this.scene = scene;
    this.camera = camera;
    this.name = "Canon";
    this.receiverType = receiverType;
    this.orientation = orientation;

    this.initialScaleY = 0.6;
    this.flashIntensity = 0;

    this._spriteWorldPos = new THREE.Vector3();

    this._spriteCanvas = document.createElement("canvas");
    this._spriteCanvas.width = 64;
    this._spriteCanvas.height = 64;
    this._spriteCtx = this._spriteCanvas.getContext("2d");

    this.spriteTexture = new THREE.CanvasTexture(this._spriteCanvas);
    const mat = new THREE.SpriteMaterial({ map: this.spriteTexture, depthTest: false });
    this.sprite = new THREE.Sprite(mat);
    this.sprite.position.set(0, -.4, 0);
    this.sprite.renderOrder = 999;

    this._updateReceiverVisuals();
  }

  _redrawSpriteCanvas() {
    const ctx = this._spriteCtx;
    ctx.clearRect(0, 0, 64, 64);
    ctx.fillStyle = SIGNAL_BG_COLORS[this.receiverType];
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,220,150,1)";
    ctx.lineWidth = 4;
    ctx.stroke();

    const img = signalImages[this.receiverType];
    const drawImg = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(32, 32, 22, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 12, 12, 40, 40);
      ctx.restore();
      this.spriteTexture.needsUpdate = true;
    };
    if (img.complete) {
      drawImg();
    } else {
      img.onload = drawImg;
    }
  }

  _updateReceiverVisuals() {
    this.description = `Receiver: ${SIGNAL_LABELS[this.receiverType]}`;
    this._redrawSpriteCanvas();
  }

  action() {
    this.receiverType = (this.receiverType + 1) % 4;
    this._updateReceiverVisuals();
  }

  move() {

  }

  rotate() {
    this.orientation = (this.orientation + 1) % 4;
    this.flashIntensity = 1.5;
    this.mesh.scale.y = 1.2;
    if (this.mesh) this.mesh.rotation.y = ORIENTATIONS[this.orientation].rotY;
  }

  fire() {
    if (!this.mesh) return;

    const { velocity, burstOffset } = ORIENTATIONS[this.orientation];

    const worldPos = new THREE.Vector3();
    this.mesh.getWorldPosition(worldPos);
    worldPos.y += 0.5;

    this.mesh.scale.y = 0.5;
    this.flashIntensity = 1.5;

    ParticleSystem.instance.burst(this.mesh.position.clone().add(burstOffset), 30, .7, 1.0, 0xffaa55);

    Bullet.get(this.scene, worldPos, velocity.clone(), 0.1, 3.0, this);
  }

  _update() {
    if (!this.mesh) return;

    if (!this._spriteAttached) {
      this.mesh.add(this.sprite);
      this.mesh.rotation.y = ORIENTATIONS[this.orientation].rotY;
      this._spriteAttached = true;
    }

    this.mesh.scale.y = utils.lerp(this.mesh.scale.y, this.initialScaleY, Time.instance.dt() * 9.0);

    this.flashIntensity = utils.lerp(this.flashIntensity, 0, Time.instance.dt() * 9.0);
    this.mesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive = new THREE.Color(SIGNAL_COLORS[this.receiverType]).multiplyScalar(this.flashIntensity);
      }
    });

    if (this.camera) {
      this.sprite.getWorldPosition(this._spriteWorldPos);
      const dist = this.camera.position.distanceTo(this._spriteWorldPos);
      const k = 0.06;
      this.sprite.scale.set(dist * k, dist * k, 1);
    }
  }
}

export default Canon;
