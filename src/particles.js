import * as THREE from "three";

import Time from "./time.js";
import * as utils from "./utils.js";

const PREALLOC_PARTICLES = 200;

class ParticleSystem {
  constructor(prealloc = 10) {
    this.emitters = [];
    for (let i = 0; i < prealloc; i++) {
      let pe = new ParticleEmitter();
      this.emitters.push(pe);
    }
  }

  init(scene) {
    this.scene = scene;
  }

  update() {
    for (let e of this.emitters) {
      if (e.active) e.update();
    }
  }

  getEmitter() {
    for (let emitter of this.emitters) {
      if (!emitter.active) return emitter;
    }

    return null;
  }

  burst(pos, amount, spread, speed = 1) {
    let e = this.getEmitter();
    if (e == null) return;

    e.scene = this.scene;
    e.init(
      pos,
      amount,
      0.4,
      (p) => {
        p.velocity = new THREE.Vector3(
          utils.randrange(-0.1 * spread, 0.1 * spread) * speed,
          0.3 * speed,
          utils.randrange(-0.1 * spread, 0.1 * spread) * speed,
        );
      },
      (p) => {
        p.position.add(p.velocity);

        if (p.velocity.length() > 0.09) {
          p.velocity.multiplyScalar(0.55);
        } else {
          p.velocity.multiplyScalar(0.97);
        }
      },
    );
  }
}

class ParticleEmitter {
  constructor() {
    this.active = false;
    this.particles = [];
    this.scene = null;

    this.geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x99eeee,
      transparent: true,
      opacity: 0.8
    });

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      PREALLOC_PARTICLES,
    );
    this.mesh.count = 0;

    for (let i = 0; i < PREALLOC_PARTICLES; i++) {
      let particle = new Particle();
      this.particles.push(particle);
    }
  }

  init(pos, amount, lifetime, initFunc, updateFunc) {
    const max_particles = Math.min(amount, this.particles.length);

    for (let i = 0; i < max_particles; i++) {
      let p = this.particles[i];
      p.init(pos, lifetime, initFunc, updateFunc);
    }

    this.mesh.count = max_particles;
    this.active = true;

    this.update();
    if (this.scene) {
      this.scene.add(this.mesh);
    }
  }

  update() {
    let activeParticles = 0;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.active) {
        p.update();

        let pos = p.active ? p.position : new THREE.Vector3(0, 100000, 0);
        dummy.position.copy(pos);
        dummy.updateMatrix();
        this.mesh.setMatrixAt(i, dummy.matrix);
        activeParticles++;
      }
    }

    this.mesh.instanceMatrix.needsUpdate = true;

    if (activeParticles === 0) {
      this.active = false; if (this.scene) { this.scene.remove(this.mesh); }
    }
  }
}

class Particle {
  constructor() {
    this.active = false;
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.lifetime = 5.0;
    this.updateFunction = null;
  }

  init(pos, lifetime, initFunction, updateFunction) {
    this.active = true;
    this.position = new THREE.Vector3(0, 0, 0).add(pos);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.lifetime = lifetime + utils.randrange(-0.5, 0.5);
    this.updateFunction = updateFunction;
    initFunction(this);
  }

  update() {
    this.lifetime -= Time.instance.dt();
    if (this.lifetime <= 0) this.destroy();
    if (!this.active) return;

    if (this.updateFunction != null) this.updateFunction(this);
  }

  destroy() {
    this.active = false;
  }
}

ParticleSystem.instance = new ParticleSystem();
export default ParticleSystem;
