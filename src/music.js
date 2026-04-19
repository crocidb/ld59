class MusicManager {
  static instance = new MusicManager();

  constructor() {
    this._sound = null;
    this._lowPassFilter = null;
    this._filterAdded = false;
    this._muffled = false;
    this._playing = false;
    this._onFirstInteraction = this._onFirstInteraction.bind(this);
  }

  init() {
    if (this._sound !== null) return;

    if (typeof Pizzicato === 'undefined') {
      console.warn('[MusicManager] Pizzicato not loaded — music disabled.');
      return;
    }

    this._lowPassFilter = new Pizzicato.Effects.LowPassFilter({
      frequency: 22050,
      peak: 10
    });

    this._sound = new Pizzicato.Sound(
      { source: 'file', options: { path: 'assets/music/music.ogg', loop: true } },
      () => { this._attemptPlay(); }
    );
  }

  _attemptPlay() {
    if (this._playing) return;
    // Add the filter once, before the first play, while the sound is not yet playing.
    // Changing it later is done via frequency only — never addEffect/removeEffect on a live sound.
    if (!this._filterAdded) {
      this._sound.addEffect(this._lowPassFilter);
      this._filterAdded = true;
    }
    try {
      const result = this._sound.play();
      if (result && typeof result.then === 'function') {
        result.then(() => {
          this._playing = true;
          window.removeEventListener('click', this._onFirstInteraction);
          window.removeEventListener('keydown', this._onFirstInteraction);
        }).catch(() => {
          this._registerInteractionFallback();
        });
      } else {
        this._playing = true;
      }
    } catch (e) {
      this._registerInteractionFallback();
    }
  }

  _registerInteractionFallback() {
    window.addEventListener('click', this._onFirstInteraction, { once: true });
    window.addEventListener('keydown', this._onFirstInteraction, { once: true });
  }

  _onFirstInteraction() {
    window.removeEventListener('click', this._onFirstInteraction);
    window.removeEventListener('keydown', this._onFirstInteraction);
    if (!this._playing && this._sound) {
      this._sound.play();
      this._playing = true;
    }
  }

  muffle(enable) {
    if (!this._lowPassFilter) return;
    if (enable === this._muffled) return;
    this._lowPassFilter.frequency = enable ? 350 : 22050;
    this._muffled = enable;
  }

  play() {
    if (!this._sound) return;
    this.muffle(false);
    this._attemptPlay();
  }

  stop() {
    if (this._sound && this._playing) {
      try { this._sound.stop(); } catch (e) { /* node not ready */ }
      this._playing = false;
    }
    this._muffled = false;
    if (this._lowPassFilter) this._lowPassFilter.frequency = 22050;
    window.removeEventListener('click', this._onFirstInteraction);
    window.removeEventListener('keydown', this._onFirstInteraction);
  }
}

export default MusicManager;
