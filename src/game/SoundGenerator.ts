import type { EraType } from './types';
import { publicAssetPath } from './assets';

type WebAudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

class SoundGenerator {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmSrc = '';
  private bgmFadeTimer: ReturnType<typeof window.setInterval> | null = null;
  private bgmVolume = 0.16;
  private currentEra: EraType = 'HADEAN_ARCHEAN';

  constructor() {
    // インスタンス化の時点ではAudioContextを作成しない（ユーザー操作によるアクティベーションを待つため）
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as WebAudioWindow).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime); // 全体音量
      this.masterGain.connect(this.ctx.destination);

      this.startEraBgm();
    } catch (e) {
      console.warn('Web Audio API is not supported in this browser.', e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.bgmAudio) {
      this.startEraBgm();
      return;
    }
    void this.playCurrentBgm();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }
    if (!this.isMuted) {
      void this.playCurrentBgm();
    }
    return this.isMuted;
  }

  public setEra(era: EraType) {
    if (this.currentEra === era) return;
    this.currentEra = era;
    this.startEraBgm();
  }

  // --- 効果音のシンセサイズ ---

  // 1. エサを食べた音（澄んだピコッ音）
  public playEatFood() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.15); // C6へスイープ

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  // 2. 特殊な栄養（DNA）を食べた音（キラリ音）
  public playEatDna() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    const notes = [587.33, 783.99, 1174.66]; // D5, G5, D6 (アルペジオ)
    
    const ctx = this.ctx;
    const masterGain = this.masterGain;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const nt = t + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, nt);

      gain.gain.setValueAtTime(0.12, nt);
      gain.gain.exponentialRampToValueAtTime(0.001, nt + 0.25);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(nt);
      osc.stop(nt + 0.26);
    });
  }

  // 3. ダメージを受けた音（低い激しいノイズと衝撃）
  public playDamage() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    
    // サイン波での重低音衝撃
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.2);
    
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.21);

    // ホワイトノイズによる摩擦音
    const bufferSize = this.ctx.sampleRate * 0.15; // 0.15秒分
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(300, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noiseSource.start(t);
    noiseSource.stop(t + 0.16);
  }

  // 4. 進化成功音（壮大なライジングトーン）
  public playEvolution() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    const baseFreq = 261.63; // C4
    const intervals = [0, 4, 7, 11, 12, 16, 19]; // メジャーセブンスアルペジオ

    const ctx = this.ctx;
    const masterGain = this.masterGain;

    intervals.forEach((interval, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const nt = t + idx * 0.08;
      const freq = baseFreq * Math.pow(2, interval / 12);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, nt);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, nt + 0.4);

      gain.gain.setValueAtTime(0, nt);
      gain.gain.linearRampToValueAtTime(0.15, nt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, nt + 0.45);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(nt);
      osc.stop(nt + 0.46);
    });
  }

  // 5. 大絶滅イベントの警報音（ウー、ウーというパルス）
  public playExtinctionWarning() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    
    // 警報パルスを2サイクル再生
    for (let cycle = 0; cycle < 2; cycle++) {
      const start = t + cycle * 0.6;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, start);
      osc.frequency.linearRampToValueAtTime(440, start + 0.3);
      osc.frequency.linearRampToValueAtTime(220, start + 0.5);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.1);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + 0.56);
    }
  }

  // 6. ゲームオーバー音（ダウントーン）
  public playGameOver() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(147.00, t); // D3
    osc.frequency.linearRampToValueAtTime(73.42, t + 1.2); // D2

    // ローパスフィルタでこもらせる
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.linearRampToValueAtTime(100, t + 1.2);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.001, t + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.21);
  }

  // 7. ゲームクリア音（ファンファーレ）
  public playGameClear() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 523.25]; // C major chord

    const ctx = this.ctx;
    const masterGain = this.masterGain;

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const nt = t + idx * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, nt);
      
      gain.gain.setValueAtTime(0, nt);
      gain.gain.linearRampToValueAtTime(0.12, nt + 0.05);
      gain.gain.linearRampToValueAtTime(0.12, nt + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, nt + 1.8);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(nt);
      osc.stop(nt + 1.81);
    });
  }

  // --- 時代別BGM（Suno生成MP3） ---

  private getBgmPath(era: EraType) {
    switch (era) {
      case 'HADEAN_ARCHEAN':
      case 'PROTEROZOIC':
        return publicAssetPath('audio/bgm/precambrian.mp3');
      case 'PALEOZOIC':
        return publicAssetPath('audio/bgm/paleozoic.mp3');
      case 'MESOZOIC':
        return publicAssetPath('audio/bgm/mesozoic.mp3');
      case 'CENOZOIC':
        return publicAssetPath('audio/bgm/cenozoic.mp3');
      default:
        return publicAssetPath('audio/bgm/precambrian.mp3');
    }
  }

  private startEraBgm() {
    const nextSrc = this.getBgmPath(this.currentEra);
    if (this.bgmAudio && this.bgmSrc === nextSrc) {
      void this.playCurrentBgm();
      return;
    }

    if (this.bgmFadeTimer) {
      window.clearInterval(this.bgmFadeTimer);
      this.bgmFadeTimer = null;
    }

    const previous = this.bgmAudio;
    if (previous) {
      this.fadeOutAndStop(previous);
    }

    const audio = new Audio(nextSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audio.muted = this.isMuted;
    this.bgmAudio = audio;
    this.bgmSrc = nextSrc;
    void this.playCurrentBgm();
    this.fadeIn(audio);
  }

  private async playCurrentBgm() {
    if (!this.bgmAudio || this.isMuted) return;
    try {
      await this.bgmAudio.play();
    } catch {
      // ブラウザの自動再生制限中は、次のユーザー操作後の resume() で再試行する。
    }
  }

  private fadeIn(audio: HTMLAudioElement) {
    const step = this.bgmVolume / 20;
    this.bgmFadeTimer = window.setInterval(() => {
      if (this.bgmAudio !== audio) {
        window.clearInterval(this.bgmFadeTimer!);
        this.bgmFadeTimer = null;
        return;
      }
      audio.volume = Math.min(this.bgmVolume, audio.volume + step);
      if (audio.volume >= this.bgmVolume) {
        window.clearInterval(this.bgmFadeTimer!);
        this.bgmFadeTimer = null;
      }
    }, 80);
  }

  private fadeOutAndStop(audio: HTMLAudioElement) {
    const step = Math.max(audio.volume, this.bgmVolume) / 15;
    const timer = window.setInterval(() => {
      audio.volume = Math.max(0, audio.volume - step);
      if (audio.volume <= 0) {
        window.clearInterval(timer);
        audio.pause();
        audio.currentTime = 0;
      }
    }, 60);
  }

  public stopAll() {
    if (this.bgmFadeTimer) {
      window.clearInterval(this.bgmFadeTimer);
      this.bgmFadeTimer = null;
    }
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.bgmAudio = null;
      this.bgmSrc = '';
    }
  }
}

export const sound = new SoundGenerator();
