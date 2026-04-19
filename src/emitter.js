import * as THREE from "three";

import Pawn, { SIGNAL_LABELS, SIGNAL_COLORS, SIGNAL_BG_COLORS, signalImages } from "./pawn.js";
import Time from "./time.js";
import RingSignal from "./ringsignal.js";
import ParticleSystem from "./particles.js";

import * as utils from "./utils.js";

class Emitter extends Pawn {
  constructor(scene, board, x, y, type, rate, camera) {
    super(board, "/assets/emitter.glb", x, y);
    this.name = "Emitter";
    this.description = "";
    this.type = type;
    this.rate = rate;
    this.camera = camera;

    this.maxLife = 5;
    this.life = this.maxLife;

    this._spriteCanvas = document.createElement("canvas");
    this._spriteCanvas.width = 64;
    this._spriteCanvas.height = 84;
    this._spriteCtx = this._spriteCanvas.getContext("2d");

    this.spriteTexture = new THREE.CanvasTexture(this._spriteCanvas);
    const mat = new THREE.SpriteMaterial({ map: this.spriteTexture, depthTest: false });
    this.sprite = new THREE.Sprite(mat);
    this._iconReady = false;
    this._updateEmitterVisuals();
    this.sprite.position.set(0, -0.1, 0);
    this.sprite.renderOrder = 999;

    this.rings = [];
    for (let i = 0; i < 3; i++) {
      this.rings.push(
        new RingSignal(scene, {
          minRadius: 0.05,
          maxRadius: 10.0,
          speed: 5.5,
          color: SIGNAL_COLORS[this.type],
        }),
      );
    }

    this.initialScaleY = 0.6;
    this.rateCounter = 0;
    this._spriteScale = 0.055;
    this._flashColor = new THREE.Color(SIGNAL_COLORS[this.type]);
    this._flashDecay = 10.0;
  }

  _redrawSpriteCanvas() {
    const ctx = this._spriteCtx;
    ctx.clearRect(0, 0, 64, 84);
    ctx.fillStyle = SIGNAL_BG_COLORS[this.type];
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(150,255,255,1)";
    ctx.lineWidth = 4;
    ctx.stroke();

    const img = signalImages[this.type];
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

  _updateEmitterVisuals() {
    this.description = `Emitter: ${SIGNAL_LABELS[this.type]}`;
    this._redrawSpriteCanvas();
  }

  _getRing() {
    for (let ring of this.rings) {
      if (!ring.active) return ring;
    }

    return null;
  }

  action() {}

  emit() {
    let ring = this._getRing();
    if (ring == null) return;

    if (this.mesh != null) {
      ParticleSystem.instance.burst(this.mesh.position, 30, 1.9, 1.0, SIGNAL_COLORS[this.type]);
      ring.emit(this.mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
      this.mesh.scale.y = 0.8;
      this.flashIntensity = 1.2;
      this._flashColor.set(SIGNAL_COLORS[this.type]);
    }
  }

  _update() {
    for (let ring of this.rings) {
      ring.update();
    }

    this.rateCounter += Time.instance.dt();
    if (this.rateCounter >= this.rate) {
      this.rateCounter = 0;
      this.emit();
    }

    if (this.mesh) {
      if (!this._spriteAttached) {
        this.mesh.add(this.sprite);
        this._spriteAttached = true;
      }

      if (!this._iconReady) {
        const img = signalImages[this.type];
        if (img.complete) this._redrawSpriteCanvas();
      }

      this.mesh.scale.y = utils.lerp(
        this.mesh.scale.y,
        this.initialScaleY,
        Time.instance.dt() * 9.0,
      );
    }
  }
}

export default Emitter;
