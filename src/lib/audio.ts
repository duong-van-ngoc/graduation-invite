"use client";

class SoundEffects {
  private ctx: AudioContext | null = null;
  private bgm: HTMLAudioElement | null = null;
  private bgmPlaying = false;
  private explosionVolume = 2.6;

  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error("Web Audio API is not supported in this browser");
        }
        this.ctx = new AudioContextClass();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser", e);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Bắt đầu phát nhạc nền với hiệu ứng tăng dần âm lượng (Fade-in)
  playBGM() {
    if (typeof window === "undefined") return;
    this.init();

    if (!this.bgm) {
      this.bgm = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3");
      this.bgm.loop = true;
    }

    if (this.bgm.paused) {
      this.bgm.volume = 0;
      this.bgm.play().then(() => {
        this.bgmPlaying = true;
        let vol = 0;
        const targetVol = 0.22;
        const interval = setInterval(() => {
          if (!this.bgm || !this.bgmPlaying) {
            clearInterval(interval);
            return;
          }
          vol += 0.02;
          if (vol >= targetVol) {
            this.bgm.volume = targetVol;
            clearInterval(interval);
          } else {
            this.bgm.volume = vol;
          }
        }, 80);
      }).catch(err => {
        console.warn("Autoplay BGM prevented by browser, waiting for user gesture.", err);
      });
    }
  }

  // Tắt/Bật nhạc nền, trả về trạng thái mới (true = đang phát, false = dừng)
  toggleBGM(): boolean {
    if (!this.bgm) {
      this.playBGM();
      return true;
    }

    if (this.bgm.paused) {
      this.bgm.play().then(() => {
        this.bgmPlaying = true;
      });
      this.bgm.volume = 0.22;
      return true;
    } else {
      this.bgm.pause();
      this.bgmPlaying = false;
      return false;
    }
  }

  // Kiểm tra xem nhạc nền có đang phát không
  isBGMPlaying(): boolean {
    return this.bgm ? !this.bgm.paused : false;
  }

  // Đặt âm lượng nhạc nền (0.0 - 1.0)
  setBGMVolume(vol: number) {
    if (this.bgm) {
      this.bgm.volume = Math.max(0, Math.min(1, vol));
    }
  }

  // Lấy âm lượng hiện tại của nhạc nền
  getBGMVolume(): number {
    return this.bgm ? this.bgm.volume : 0.22;
  }

  setExplosionVolume(vol: number) {
    this.explosionVolume = Math.max(0, Math.min(5, vol));
  }

  // Tiếng mở phong bì (tiếng xoẹt giấy nhẹ nhàng, sang trọng)
  playOpenEnvelope() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Tạo Buffer trắng chứa tiếng xào xạc
    const bufferSize = ctx.sampleRate * 0.4; // 0.4 giây
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bộ lọc thông dải để tạo âm thanh xột xoạt giấy chân thực
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.4);
    filter.Q.setValueAtTime(2.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  // Tiếng rít pháo hoa phóng lên (whoosh/whistle)
  playRocketLaunch() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 1.3); // Tần số tăng dần khi bay lên cao

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.012, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    // Bộ lọc thông thấp để âm thanh rít êm dịu, không chói tai
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1100, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  // Tiếng nổ pháo hoa (boom trầm ấm + nổ hạt lách tách crackle)
  playExplosion(isBig = false) {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. Tiếng bùm tần số thấp (Low frequency base boom)
    const osc = ctx.createOscillator();
    const compressor = ctx.createDynamicsCompressor();
    const oscGain = ctx.createGain();
    compressor.threshold.setValueAtTime(-14, now);
    compressor.knee.setValueAtTime(18, now);
    compressor.ratio.setValueAtTime(8, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.18, now);
    compressor.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(isBig ? 70 : 90, now);
    osc.frequency.exponentialRampToValueAtTime(15, now + 0.9);

    oscGain.gain.setValueAtTime((isBig ? 1.25 : 0.46) * this.explosionVolume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(oscGain);
    oscGain.connect(compressor);
    osc.start(now);
    osc.stop(now + 0.9);

    // 2. Tiếng nổ giòn bề mặt (Noise burst)
    const bufferSize = ctx.sampleRate * 0.7;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(280, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(40, now + 0.7);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime((isBig ? 0.56 : 0.34) * this.explosionVolume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(compressor);
    noise.start(now);

  }
}

export const sfx = new SoundEffects();
