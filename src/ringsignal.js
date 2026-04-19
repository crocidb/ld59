import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

import Time from "./time.js";

const RING_POINTS = Math.PI * 200;

class RingSignal {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.active = false;

    this.minRadius = options.minRadius ?? 0.05;
    this.maxRadius = options.maxRadius ?? 1.2;
    this.speed = options.speed ?? 1.5;
    this.color = options.color ?? 0xffffff;
    this.linewidth = options.linewidth ?? 6;

    this.geometry = new LineGeometry();

    this.material = new LineMaterial({
      color: this.color,
      linewidth: this.linewidth,
      transparent: true,
      opacity: 1.0,
      resolution: new THREE.Vector2(1, 1),
    });

    this.line = new Line2(this.geometry, this.material);
    this.line.visible = false;
    this.triggered = new Set();
  }

  resize(w, h) {
    this.material.resolution.set(w, h);
  }

  emit(origin) {
    this.origin = origin.clone();
    this.radius = this.minRadius;
    this.material.opacity = 1.0;
    this.line.visible = true;
    this.active = true;
    this.triggered.clear();
    this._updatePoints();
    this.scene.add(this.line);
  }

  _updatePoints() {
    const positions = [];
    for (let i = 0; i <= RING_POINTS; i++) {
      const angle = (i / RING_POINTS) * Math.PI * 2;
      positions.push(
        this.origin.x + Math.cos(angle) * this.radius,
        this.origin.y + Math.sin((Time.instance.totalTime + i  * .003) * 20) * .2,
        this.origin.z + Math.sin(angle) * this.radius,
      );
    }
    this.geometry.setPositions(positions);
  }

  update() {
    if (!this.active) return;

    const dt = Time.instance.dt();
    this.radius += this.speed * dt;

    const t = (this.radius - this.minRadius) / (this.maxRadius - this.minRadius);
    this.material.opacity = 1.0 - Math.max(0, t);

    if (this.radius >= this.maxRadius) {
      this.active = false;
      this.line.visible = false;
      this.scene.remove(this.line);
      return;
    }

    this._updatePoints();
  }

  destroy() {
    this.active = false;
    this.scene.remove(this.line);
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default RingSignal;
