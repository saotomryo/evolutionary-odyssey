import type { EraType } from './types';

class SoundGenerator {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted = false;
  private bgmInterval: any = null;
  private bgmNodes: AudioNode[] = [];
  private currentEra: EraType = 'HADEAN_ARCHEAN';

  constructor() {
    // インスタンス化の時点ではAudioContextを作成しない（ユーザー操作によるアクティベーションを待つため）
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime); // 全体音量
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime); // BGM用音量
      this.bgmGain.connect(this.masterGain);

      this.startAmbientBgm();
    } catch (e) {
      console.warn('Web Audio API is not supported in this browser.', e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setEra(era: EraType) {
    this.currentEra = era;
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

  // --- 環境BGM（アンビエント）エンジン ---

  private startAmbientBgm() {
    if (!this.ctx || !this.bgmGain || this.bgmInterval) return;

    let beat = 0;
    
    // コード進行の定義（時代によって変化させる）
    const getChords = (era: EraType) => {
      switch (era) {
        case 'HADEAN_ARCHEAN':
          // 冥王代：不安、不協和、熱水（Fm, Gdim）
          return [
            [87.31, 103.83, 130.81, 174.61], // Fm (F2, G#2, C3, F3)
            [98.00, 116.54, 138.59, 196.00]  // Gdim (G2, A#2, C#3, G3)
          ];
        case 'PROTEROZOIC':
          // 原生代：極寒、孤独、静寂（Am, Fmaj7）
          return [
            [110.00, 130.81, 164.81, 220.00], // Am (A2, C3, E3, A3)
            [87.31, 130.81, 174.61, 218.27]   // Fmaj7 (F2, C3, F3, A3)
          ];
        case 'PALEOZOIC':
          // 古生代：進化、躍動、生命（C, G）
          return [
            [130.81, 164.81, 196.00, 261.63], // C (C3, E3, G3, C4)
            [98.00, 146.83, 196.00, 293.66]   // G (G2, D3, G3, D4)
          ];
        case 'MESOZOIC':
          // 中生代：温暖、巨大（D, A）
          return [
            [146.83, 185.00, 220.00, 293.66], // D (D3, F#3, A3, D4)
            [110.00, 164.81, 220.00, 329.63]  // A (A2, E3, A3, E4)
          ];
        case 'CENOZOIC':
          // 新生代：知性、現代（Cmaj7, Fmaj7）
          return [
            [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
            [174.61, 218.27, 261.63, 329.63]  // Fmaj7 (F3, A3, C4, E4)
          ];
        default:
          return [[130.81, 164.81, 196.00, 261.63]];
      }
    };

    const playChordNote = (freq: number, start: number, duration: number) => {
      if (!this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine'; // まろやかな波形
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.04, start + 1.5); // ゆっくり立ち上がるアタック
      gain.gain.linearRampToValueAtTime(0.04, start + duration - 2);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration); // ゆっくり消えるディケイ

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(start);
      osc.stop(start + duration + 0.1);

      this.bgmNodes.push(osc);
      this.bgmNodes.push(gain);

      // 古い不要なノードをクリーンアップ
      if (this.bgmNodes.length > 50) {
        this.bgmNodes.splice(0, 10);
      }
    };

    // 4秒おきにアンビエントパッドとアルペジオを生成
    const tick = () => {
      if (!this.ctx || !this.bgmGain || this.isMuted || this.ctx.state === 'suspended') return;

      const t = this.ctx.currentTime;
      const chords = getChords(this.currentEra);
      const activeChord = chords[beat % chords.length];

      // 1. ドローンパッド音（和音）をゆっくり鳴らす（各音1音ずつ、ずらしながら）
      activeChord.forEach((freq, idx) => {
        playChordNote(freq, t + idx * 0.15, 5.0);
      });

      // 2. メロディのポツポツ音（ランダム）
      if (Math.random() > 0.4) {
        // アクティブな和音の最高音オクターブからランダム選択
        const noteFreq = activeChord[Math.random() > 0.5 ? 2 : 3] * 2.0;
        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();
        const startOffset = 1.0 + Math.random() * 2.0;

        melOsc.type = 'sine';
        melOsc.frequency.setValueAtTime(noteFreq, t + startOffset);

        // ビブラート（ディレイ／デチューン効果）を演出
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.setValueAtTime(4 + Math.random() * 2, t); // 4-6Hz
        vibratoGain.gain.setValueAtTime(5, t); // 強度
        vibrato.connect(vibratoGain);
        vibratoGain.connect(melOsc.detune);

        melGain.gain.setValueAtTime(0, t + startOffset);
        melGain.gain.linearRampToValueAtTime(0.03, t + startOffset + 0.2);
        melGain.gain.exponentialRampToValueAtTime(0.001, t + startOffset + 2.0);

        melOsc.connect(melGain);
        melGain.connect(this.bgmGain);

        vibrato.start(t + startOffset);
        melOsc.start(t + startOffset);
        
        vibrato.stop(t + startOffset + 2.1);
        melOsc.stop(t + startOffset + 2.1);
      }

      beat++;
    };

    // 初回実行
    tick();
    this.bgmInterval = setInterval(tick, 4500); // 4.5秒周期
  }

  public stopAll() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmNodes.forEach(node => {
      try {
        (node as any).stop?.();
      } catch (e) {}
    });
    this.bgmNodes = [];
  }
}

export const sound = new SoundGenerator();
