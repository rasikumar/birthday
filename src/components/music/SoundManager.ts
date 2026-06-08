/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundManagerClass {
  private ctx: AudioContext | null = null;
  private currentAtmosphere: string | null = null;
  private atmosphereNodes: {
    osc1?: OscillatorNode;
    osc2?: OscillatorNode;
    gainNode?: GainNode;
    filterNode?: BiquadFilterNode;
  } | null = null;
  private intervalId: any = null;
  private globalVolume: number = 0.5;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setVolume(vol: number) {
    this.globalVolume = Math.max(0, Math.min(1, vol));
    if (this.atmosphereNodes?.gainNode) {
      this.atmosphereNodes.gainNode.gain.setValueAtTime(
        this.globalVolume * 0.15,
        this.ctx ? this.ctx.currentTime : 0,
      );
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.atmosphereNodes?.gainNode) {
      this.atmosphereNodes.gainNode.gain.setValueAtTime(
        muted ? 0 : this.globalVolume * 0.15,
        this.ctx ? this.ctx.currentTime : 0,
      );
    }
  }

  // Purely procedural sound effect synthetics
  playSFX(
    type:
      | "click"
      | "hover"
      | "metal_lock"
      | "heartbeat"
      | "paper"
      | "wax_crack"
      | "confetti"
      | "chime"
      | "sparkles",
  ) {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const ct = this.ctx.currentTime;
      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(this.globalVolume * 0.6, ct);
      mainGain.connect(this.ctx.destination);

      switch (type) {
        case "click": {
          // Sharp vintage toggle plip
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(800, ct);
          osc.frequency.exponentialRampToValueAtTime(100, ct + 0.08);
          gain.gain.setValueAtTime(0.15, ct);
          gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.08);
          osc.connect(gain);
          gain.connect(mainGain);
          osc.start(ct);
          osc.stop(ct + 0.1);
          break;
        }

        case "hover": {
          // Velvet chime plip
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(440, ct);
          osc.frequency.exponentialRampToValueAtTime(880, ct + 0.12);
          gain.gain.setValueAtTime(0.06, ct);
          gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.15);
          osc.connect(gain);
          gain.connect(mainGain);
          osc.start(ct);
          osc.stop(ct + 0.16);
          break;
        }

        case "metal_lock": {
          // Deep mechanical latch & heavy lever click
          const oscL = this.ctx.createOscillator();
          const oscH = this.ctx.createOscillator();
          const gainL = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          oscL.type = "sawtooth";
          oscL.frequency.setValueAtTime(75, ct);
          oscL.frequency.linearRampToValueAtTime(25, ct + 0.28);

          oscH.type = "triangle";
          oscH.frequency.setValueAtTime(190, ct);
          oscH.frequency.exponentialRampToValueAtTime(1100, ct + 0.15);

          filter.type = "bandpass";
          filter.frequency.setValueAtTime(320, ct);
          filter.Q.setValueAtTime(15, ct);

          gainL.gain.setValueAtTime(0.4, ct);
          gainL.gain.exponentialRampToValueAtTime(0.001, ct + 0.35);

          oscL.connect(filter);
          oscH.connect(filter);
          filter.connect(gainL);
          gainL.connect(mainGain);

          oscL.start(ct);
          oscH.start(ct);
          oscL.stop(ct + 0.4);
          oscH.stop(ct + 0.4);
          break;
        }

        case "heartbeat": {
          // Authentic rhythmic cardiovascular thumping
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = "sine";
          // Double thump
          osc.frequency.setValueAtTime(55, ct);
          osc.frequency.setValueAtTime(50, ct + 0.15);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(80, ct);

          gain.gain.setValueAtTime(0.8, ct);
          gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.12);
          gain.gain.setValueAtTime(0.6, ct + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.32);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(mainGain);

          osc.start(ct);
          osc.stop(ct + 0.4);
          break;
        }

        case "paper": {
          // Authentic paper rustling sequence using filtered noise
          const bufferSize = this.ctx.sampleRate * 0.35;
          const buffer = this.ctx.createBuffer(
            1,
            bufferSize,
            this.ctx.sampleRate,
          );
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noiseSource = this.ctx.createBufferSource();
          noiseSource.buffer = buffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1200, ct);
          filter.frequency.exponentialRampToValueAtTime(3400, ct + 0.28);
          filter.Q.setValueAtTime(3.0, ct);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.18, ct);
          gain.gain.linearRampToValueAtTime(0.09, ct + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.35);

          noiseSource.connect(filter);
          filter.connect(gain);
          gain.connect(mainGain);

          noiseSource.start(ct);
          break;
        }

        case "wax_crack": {
          // Vintage wax seal snapping sound
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const bp = this.ctx.createBiquadFilter();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(1400, ct);
          osc.frequency.setValueAtTime(120, ct + 0.05);

          bp.type = "bandpass";
          bp.frequency.setValueAtTime(850, ct);

          gain.gain.setValueAtTime(0.3, ct);
          gain.gain.setValueAtTime(0.8, ct + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.22);

          osc.connect(bp);
          bp.connect(gain);
          gain.connect(mainGain);

          osc.start(ct);
          osc.stop(ct + 0.25);
          break;
        }

        case "confetti": {
          // Upbeat balloon popping with high-pass sparkles
          const oscL = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          oscL.type = "sawtooth";
          oscL.frequency.setValueAtTime(85, ct);
          oscL.frequency.exponentialRampToValueAtTime(10, ct + 0.18);

          gain.gain.setValueAtTime(0.6, ct);
          gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.25);

          oscL.connect(gain);
          gain.connect(mainGain);
          oscL.start(ct);
          oscL.stop(ct + 0.3);

          // Sparkles follow pop
          setTimeout(() => this.playSFX("sparkles"), 80);
          break;
        }

        case "chime": {
          // Luxury chime sweep (5 ascending sweet piano chords)
          const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            const chimeCt = ct + idx * 0.06;

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, chimeCt);
            gain.gain.setValueAtTime(0.12, chimeCt);
            gain.gain.exponentialRampToValueAtTime(0.001, chimeCt + 0.45);

            osc.connect(gain);
            gain.connect(mainGain);
            osc.start(chimeCt);
            osc.stop(chimeCt + 0.5);
          });
          break;
        }

        case "sparkles": {
          // Twinkling light sparkles
          const notes = [1200, 1500, 1800, 2200, 2700];
          notes.forEach((freq, index) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            const rDelay = index * 0.04 + Math.random() * 0.04;

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ct + rDelay);
            gain.gain.setValueAtTime(0.06, ct + rDelay);
            gain.gain.exponentialRampToValueAtTime(0.001, ct + rDelay + 0.2);

            osc.connect(gain);
            gain.connect(mainGain);
            osc.start(ct + rDelay);
            osc.stop(ct + rDelay + 0.25);
          });
          break;
        }
      }
    } catch (e) {
      console.warn("SFX failed: ", e);
    }
  }

  // Crossfading atmospheric soundtrack system
  setAtmosphere(
    mode: "mystery" | "piano" | "warm" | "magical" | "celebration",
  ) {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.currentAtmosphere === mode) return;

      const ct = this.ctx.currentTime;

      // Wrap-up previous loop triggers
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      // Fade out previous atmospheric nodes
      if (this.atmosphereNodes) {
        const prevGain = this.atmosphereNodes.gainNode;
        const prevOsc1 = this.atmosphereNodes.osc1;
        const prevOsc2 = this.atmosphereNodes.osc2;

        if (prevGain) {
          prevGain.gain.setValueAtTime(prevGain.gain.value, ct);
          prevGain.gain.exponentialRampToValueAtTime(0.001, ct + 1.2);
          setTimeout(() => {
            try {
              prevOsc1?.stop();
              prevOsc2?.stop();
            } catch {}
          }, 1500);
        }
      }

      this.currentAtmosphere = mode;

      // Create new fresh audio path
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      gain.gain.setValueAtTime(0.001, ct);
      gain.gain.linearRampToValueAtTime(
        this.isMuted ? 0 : this.globalVolume * 0.15,
        ct + 1.5,
      );
      gain.connect(this.ctx.destination);

      this.atmosphereNodes = { gainNode: gain, filterNode: filter };

      // Generate atmospheric loops relative to section style
      switch (mode) {
        case "mystery": {
          // Sub-bass slow strings & pulsating pad (Emin)
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(350, ct);

          const osc1 = this.ctx.createOscillator();
          osc1.type = "triangle";
          osc1.frequency.setValueAtTime(82.41, ct); // E2
          osc1.frequency.linearRampToValueAtTime(82.1, ct + 4);

          const osc2 = this.ctx.createOscillator();
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(123.47, ct); // B2

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);

          osc1.start(ct);
          osc2.start(ct);

          this.atmosphereNodes.osc1 = osc1;
          this.atmosphereNodes.osc2 = osc2;

          // Gentle ambient pulses
          let triggerPulseIdx = 0;
          this.intervalId = setInterval(() => {
            if (this.ctx && !this.isMuted) {
              const pulseCt = this.ctx.currentTime;
              const pulser = this.ctx.createOscillator();
              const pGain = this.ctx.createGain();
              pulser.type = "sine";
              const note = triggerPulseIdx % 2 === 0 ? 164.81 : 146.83; // E3 or D3
              pulser.frequency.setValueAtTime(note, pulseCt);

              pGain.gain.setValueAtTime(0.05, pulseCt);
              pGain.gain.exponentialRampToValueAtTime(0.001, pulseCt + 2.8);

              pulser.connect(pGain);
              pGain.connect(gain);
              pulser.start(pulseCt);
              pulser.stop(pulseCt + 3.0);
              triggerPulseIdx++;
            }
          }, 3200);
          break;
        }

        case "piano": {
          // Romantic soft arpeggiation loop in Db Major
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(800, ct);
          filter.connect(gain);

          const oscC = this.ctx.createOscillator();
          oscC.type = "sine";
          oscC.frequency.setValueAtTime(69.3, ct); // Db2 low drone
          oscC.connect(gain);
          oscC.start(ct);
          this.atmosphereNodes.osc1 = oscC;

          const notes = [277.18, 349.23, 415.3, 523.25]; // Db4, F4, Ab4, C5
          let noteIndex = 0;
          this.intervalId = setInterval(() => {
            if (this.ctx && !this.isMuted) {
              const pCt = this.ctx.currentTime;
              const osc = this.ctx.createOscillator();
              const pGain = this.ctx.createGain();

              osc.type = "triangle";
              osc.frequency.setValueAtTime(
                notes[noteIndex % notes.length],
                pCt,
              );

              pGain.gain.setValueAtTime(0.08, pCt);
              pGain.gain.exponentialRampToValueAtTime(0.001, pCt + 2.2);

              osc.connect(filter);
              pGain.connect(gain);
              osc.connect(pGain);

              osc.start(pCt);
              osc.stop(pCt + 2.3);
              noteIndex++;
            }
          }, 600);
          break;
        }

        case "warm": {
          // Nostalgic gentle major chord plucking pad (Cmajor7 & Fmajor7)
          filter.type = "highpass";
          filter.frequency.setValueAtTime(120, ct);

          const baseOsc = this.ctx.createOscillator();
          baseOsc.type = "triangle";
          baseOsc.frequency.setValueAtTime(130.81, ct); // C3 chord ground
          baseOsc.connect(filter);
          baseOsc.start(ct);
          this.atmosphereNodes.osc1 = baseOsc;

          filter.connect(gain);

          // Procedural plucking loop
          const chordSeq = [
            130.81, 164.81, 196.0, 246.94, 349.23, 440.0, 523.25,
          ]; // C3, E3, G3, B3, F4, A4, C5
          let chordIndex = 0;
          this.intervalId = setInterval(() => {
            if (this.ctx && !this.isMuted) {
              const tct = this.ctx.currentTime;
              const tOsc = this.ctx.createOscillator();
              const tGain = this.ctx.createGain();

              tOsc.type = "sine";
              tOsc.frequency.setValueAtTime(
                chordSeq[chordIndex % chordSeq.length],
                tct,
              );
              tGain.gain.setValueAtTime(0.09, tct);
              tGain.gain.exponentialRampToValueAtTime(0.001, tct + 1.8);

              tOsc.connect(tGain);
              tGain.connect(gain);

              tOsc.start(tct);
              tOsc.stop(tct + 2.0);
              chordIndex++;
            }
          }, 450);
          break;
        }

        case "magical": {
          // Dreamlike shimmering pads & wind-bell frequencies
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1200, ct);
          filter.Q.setValueAtTime(2.0, ct);

          const droneOsc = this.ctx.createOscillator();
          droneOsc.type = "sine";
          droneOsc.frequency.setValueAtTime(220, ct); // A3
          droneOsc.connect(gain);
          droneOsc.start(ct);
          this.atmosphereNodes.osc1 = droneOsc;

          filter.connect(gain);

          this.intervalId = setInterval(() => {
            if (this.ctx && !this.isMuted) {
              const mCt = this.ctx.currentTime;
              // Spark random bell
              const bellOsc = this.ctx.createOscillator();
              const bellGain = this.ctx.createGain();
              const freq = 600 + Math.random() * 1200;

              bellOsc.type = "sine";
              bellOsc.frequency.setValueAtTime(freq, mCt);

              bellGain.gain.setValueAtTime(0.04, mCt);
              bellGain.gain.exponentialRampToValueAtTime(0.001, mCt + 3.0);

              bellOsc.connect(filter);
              bellGain.connect(gain);
              bellOsc.connect(bellGain);

              bellOsc.start(mCt);
              bellOsc.stop(mCt + 3.2);
            }
          }, 350);
          break;
        }

        case "celebration": {
          // Bright happy major-scale glockenspiel birthday arpeggios
          const melody = [523.25, 523.25, 587.33, 523.25, 698.46, 659.25]; // Happy Birthday first section
          let melodyIndex = 0;

          const baseOsc = this.ctx.createOscillator();
          baseOsc.type = "sawtooth";
          baseOsc.frequency.setValueAtTime(110, ct); // A2 base drive
          baseOsc.connect(gain);
          baseOsc.start(ct);
          this.atmosphereNodes.osc1 = baseOsc;

          this.intervalId = setInterval(() => {
            if (this.ctx && !this.isMuted) {
              const clt = this.ctx.currentTime;
              const chime = this.ctx.createOscillator();
              const chimeGain = this.ctx.createGain();

              chime.type = "sine";
              chime.frequency.setValueAtTime(
                melody[melodyIndex % melody.length],
                clt,
              );

              chimeGain.gain.setValueAtTime(0.12, clt);
              chimeGain.gain.exponentialRampToValueAtTime(0.001, clt + 0.85);

              chime.connect(chimeGain);
              chimeGain.connect(gain);

              chime.start(clt);
              chime.stop(clt + 0.9);
              melodyIndex++;
            }
          }, 320);
          break;
        }
      }
    } catch (e) {
      console.warn("Could not transition ambient background atmosphere: ", e);
    }
  }
}

export const SoundManager = new SoundManagerClass();
