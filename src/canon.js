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

const ORIENTATION_DELTAS = [
  { dx:  0, dy:  1 },
  { dx:  1, dy:  0 },
  { dx:  0, dy: -1 },
  { dx: -1, dy:  0 },
];

class Canon extends Pawn {
  constructor(scene, board, x, z, camera, receiverType = 1, orientation = 0) {
    super(board, "assets/canon.glb", x, z);
    this.scene = scene;
    this.camera = camera;
    this.name = "Canon";
    this.receiverType = receiverType;
    this.orientation = orientation;

    this.maxLife = 5;
    this.life = this.maxLife;

    this.initialScaleY = 0.6;
    this.flashIntensity = 0;
    this._flashColor = new THREE.Color(0xffffff);

    this._spriteWorldPos = new THREE.Vector3();

    this._spriteCanvas = document.createElement("canvas");
    this._spriteCanvas.width = 64;
    this._spriteCanvas.height = 84;
    this._spriteCtx = this._spriteCanvas.getContext("2d");

    this.spriteTexture = new THREE.CanvasTexture(this._spriteCanvas);
    const mat = new THREE.SpriteMaterial({ map: this.spriteTexture, depthTest: false });
    this.sprite = new THREE.Sprite(mat);
    this.sprite.position.set(0, -.1, 0);
    this.sprite.renderOrder = 999;

    this._iconReady = false;
    this._updateReceiverVisuals();
  }

  _redrawSpriteCanvas() {
    const ctx = this._spriteCtx;
    ctx.clearRect(0, 0, 64, 84);
    ctx.fillStyle = SIGNAL_BG_COLORS[this.receiverType];
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,220,150,1)";
    ctx.lineWidth = 4;
    ctx.stroke();

    const img = signalImages[this.receiverType];
    const drawIcon = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(32, 32, 22, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 12, 12, 40, 40);
      ctx.restore();
      this._iconReady = true;
      this.spriteTexture.needsUpdate = true;
    };
    if (img.complete) {
      drawIcon();
    } else {
      img.onload = drawIcon;
    }

    this._drawLifeBar(ctx);
    this.spriteTexture.needsUpdate = true;
  }

  _drawLifeBar(ctx) {
    const ratio = this.maxLife > 0 ? this.life / this.maxLife : 0;
    const barX = 4, barY = 68, barW = 56, barH = 8, r = 3;

    ctx.fillStyle = "rgba(20,20,20,0.85)";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, r);
    ctx.fill();

    if (ratio > 0) {
      const g = Math.round(ratio * 200);
      const red = Math.round((1 - ratio) * 220);
      ctx.fillStyle = `rgb(${red},${g},30)`;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * ratio, barH, r);
      ctx.fill();
    }
  }

  _updateReceiverVisuals() {
    this.description = `<b>${SIGNAL_LABELS[this.receiverType]}</b><br><br>Click to switch`;
    this._redrawSpriteCanvas();
  }

  action() {
    this.receiverType = (this.receiverType + 1) % 4;
    this.flashIntensity = 10.0;
    this._flashColor.set(0xffffff);
    utils.play("swap");
    ParticleSystem.instance.burst(this.mesh.position.clone().add(new THREE.Vector3(0, 0, -.6)), 50, 2.0, .1, 0xffffff);
    this._updateReceiverVisuals();
  }

  move(pawns) {
    if (!this.mesh) return;

    this.flashIntensity = 1.5;
    this._flashColor.set(0xffdd44);

    const { dx, dy } = ORIENTATION_DELTAS[this.orientation];
    const nx = this.x + dx;
    const ny = this.y + dy;

    utils.play("move");

    if (nx < 0 || nx >= this.board.width || ny < 0 || ny >= this.board.height) return;
    if (pawns && pawns.some(p => p !== this && p.x === nx && p.y === ny)) return;

    this.mesh.scale.y = 1.2;
    this.moveTo(nx, ny);
  }

  rotate() {
    this.orientation = (this.orientation + 1) % 4;
    this.flashIntensity = 1.5;
    this._flashColor.set(0xffdd44);
    utils.play("rotate");
    this.mesh.scale.y = 1.2;
    if (this.mesh) this.mesh.rotation.y = ORIENTATIONS[this.orientation].rotY;
  }

  fire() {
    if (!this.mesh) return;

    const { velocity, burstOffset } = ORIENTATIONS[this.orientation];

    utils.play("shoot");

    const worldPos = new THREE.Vector3();
    this.mesh.getWorldPosition(worldPos);
    worldPos.y += 0.5;

    this.mesh.scale.y = 0.5;
    this.flashIntensity = 1.5;
    this._flashColor.set(SIGNAL_COLORS[this.receiverType]);

    ParticleSystem.instance.burst(this.mesh.position.clone().add(burstOffset), 30, .7, 1.0, 0xffaa55);

    Bullet.get(this.scene, worldPos, velocity.clone(), 0.1, 3.0, this);
  }

  _update() {
    if (!this.mesh) return;

    this.name = "Canon " + this.life + "/" + this.maxLife;

    if (!this._spriteAttached) {
      this.mesh.add(this.sprite);
      this.mesh.rotation.y = ORIENTATIONS[this.orientation].rotY;
      this._spriteAttached = true;
    }

    if (!this._iconReady) {
      const img = signalImages[this.receiverType];
      if (img.complete) this._redrawSpriteCanvas();
    }

    this.mesh.scale.y = utils.lerp(this.mesh.scale.y, this.initialScaleY, Time.instance.dt() * 9.0);

    this.flashIntensity = utils.lerp(this.flashIntensity, 0, Time.instance.dt() * 9.0);
    this.mesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive = this._flashColor.clone().multiplyScalar(this.flashIntensity);
      }
    });

    if (this.camera) {
      this.sprite.getWorldPosition(this._spriteWorldPos);
      const dist = this.camera.position.distanceTo(this._spriteWorldPos);
      const k = 0.06;
      this.sprite.scale.set(dist * k, dist * k * (84 / 64), 1);
    }
  }
}

export default Canon;
