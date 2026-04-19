import * as THREE from "three";

import Pawn from "./pawn.js";
import * as utils from "./utils.js";
import Time from "./time.js";

class Stronghold extends Pawn {
  constructor(board, x, y, camera) {
    super(board, "/assets/stronghold.glb", x, y);
    this.name = "Enemy Stronghold";
    this.description = "Destroy it to win!";
    this.camera = camera;

    this.maxLife = 10;
    this.life = this.maxLife;

    this._spriteCanvas = document.createElement("canvas");
    this._spriteCanvas.width = 64;
    this._spriteCanvas.height = 84;
    this._spriteCtx = this._spriteCanvas.getContext("2d");

    this.spriteTexture = new THREE.CanvasTexture(this._spriteCanvas);
    const mat = new THREE.SpriteMaterial({ map: this.spriteTexture, depthTest: false });
    this.sprite = new THREE.Sprite(mat);
    this.sprite.position.set(0, 0.2, 0);
    this.sprite.renderOrder = 999;

    this.initialScaleY = 0.6;
    this._spriteScale = 0.055;

    this._redrawSpriteCanvas();
  }

  _redrawSpriteCanvas() {
    const ctx = this._spriteCtx;
    ctx.clearRect(0, 0, 64, 84);

    ctx.fillStyle = "rgba(120, 20, 20, 0.9)";
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 80, 80, 1)";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,200,200,0.95)";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", 32, 32);

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

  action() {}

  _update() {
    this.name = "Enemy Stronghold " + this.life + "/" + this.maxLife;

    if (this.mesh) {
      if (!this._spriteAttached) {
        this.mesh.add(this.sprite);
        this._spriteAttached = true;
      }

      this.mesh.scale.y = utils.lerp(
        this.mesh.scale.y,
        this.initialScaleY,
        Time.instance.dt() * 9.0,
      );
    }
  }
}

export default Stronghold;
