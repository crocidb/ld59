import * as THREE from "three";

import Pawn from "./pawn.js";
import RingSignal from "./ringsignal.js";
import ParticleSystem from "./particles.js"

import * as utils from "./utils.js";

class Emitter extends Pawn {
  constructor(scene, board, x, z) {
    super(board, "/assets/emitter.glb", x, z);
    this.name = "Emitter";

    this.rings = [];
    for (let i = 0; i < 3; i++) {
      this.rings.push(
        new RingSignal(scene, {
          minRadius: 0.05,
          maxRadius: 10.0,
          speed: 5.5,
          color: 0x55ffff,
        }),
      );
    }

    this.initialScaleY = 0.6;
  }

  _getRing() {
    for (let ring of this.rings) {
      if (!ring.active) return ring;
    }

    return null;
  }

  fire() {
    let ring = this._getRing();
    if (ring == null) return;

    ParticleSystem.instance.burst(this.mesh.position, 30, 1.9, 1.0);

    ring.emit(this.mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
    if (this.mesh) this.mesh.scale.y = 0.8;
  }

  _update() {
    for (let ring of this.rings) {
      ring.update();
    }

    if (this.mesh)
      this.mesh.scale.y = utils.lerp(
        this.mesh.scale.y,
        this.initialScaleY,
        0.2,
      );
  }
}

export default Emitter;
