import type { PlayerStats } from './types';
import { EVOLUTIONS } from './constants';
import { publicAssetPath } from './assets';

export class Player {
  public x: number;
  public y: number;
  public vx = 0;
  public vy = 0;
  public radius = 18;
  public angle = 0;
  public stats: PlayerStats;
  
  // アニメーション用タイマー
  private animTimer = 0;
  private tailAngle = 0;
  public iconImage: HTMLImageElement | null = null;
  public invincibilityTimer = 0; // 無敵時間（秒数）

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
    
    // 初期ステータス
    this.stats = {
      hp: 100,
      maxHp: 100,
      energy: 0,
      maxEnergy: 100,
      score: 0,
      speed: 3.5,
      sensor: 150,
      heatResist: 10,
      coldResist: 10,
      damageReduce: 0,
      spikes: 0,
      oxygenBenefit: false,
      evolutions: []
    };
  }

  // 生命アイコンの読み込み
  public loadIconImage(eraType: string) {
    const img = new Image();
    img.src = publicAssetPath(`icons/${eraType.toLowerCase()}.png`);
    img.onload = () => {
      this.iconImage = img;
    };
    img.onerror = () => {
      this.iconImage = null;
    };
  }

  // 進化を追加
  public evolve(evolutionId: string) {
    if (this.stats.evolutions.includes(evolutionId)) return;
    this.stats.evolutions.push(evolutionId);

    // ステータスの再計算
    this.recalculateStats();
  }

  // ステータスの再計算（基本値 + 進化ボーナス）
  public recalculateStats() {
    // 基本パラメータの初期化
    let baseMaxHp = 100;
    let baseSpeed = 3.5;
    let baseSensor = 150;
    let baseHeatResist = 10;
    let baseColdResist = 10;
    let baseDamageReduce = 0;
    let baseSpikes = 0;
    let baseOxygenBenefit = false;

    // 解放されている進化のボーナスを加算
    this.stats.evolutions.forEach(evoId => {
      const option = EVOLUTIONS.find(e => e.id === evoId);
      if (!option) return;

      const { stats } = option;
      if (stats.maxHp) baseMaxHp += stats.maxHp;
      if (stats.speed) baseSpeed += stats.speed;
      if (stats.sensor) baseSensor += stats.sensor;
      if (stats.heatResist) baseHeatResist += stats.heatResist;
      if (stats.coldResist) baseColdResist += stats.coldResist;
      if (stats.damageReduce) baseDamageReduce += stats.damageReduce;
      if (stats.spikes) baseSpikes += stats.spikes;
      if (stats.oxygenBenefit) baseOxygenBenefit = true;
    });

    // プレイヤーのサイズ調整 (HPに応じて少し大きくなる)
    this.radius = 16 + (baseMaxHp - 100) * 0.1;

    // ステータスの上書き（現在HPは最大値を超えないように制限）
    const hpRatio = this.stats.hp / this.stats.maxHp;
    this.stats.maxHp = baseMaxHp;
    this.stats.hp = Math.min(this.stats.maxHp, Math.round(baseMaxHp * hpRatio));
    
    this.stats.speed = baseSpeed;
    this.stats.sensor = baseSensor;
    this.stats.heatResist = Math.min(100, baseHeatResist);
    this.stats.coldResist = Math.min(100, baseColdResist);
    this.stats.damageReduce = Math.min(0.9, baseDamageReduce); // 最大90%カット
    this.stats.spikes = baseSpikes;
    this.stats.oxygenBenefit = baseOxygenBenefit;
  }

  // フレームごとの移動物理更新
  public update(targetX: number, targetY: number, isInputActive: boolean, worldWidth: number, worldHeight: number) {
    this.animTimer += 0.1;

    // 進行方向の角度計算（速度がある場合のみ更新）
    if (this.vx !== 0 || this.vy !== 0) {
      this.angle = Math.atan2(this.vy, this.vx);
    }

    if (isInputActive) {
      // ターゲット方向へのベクトル
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        // 速度制限と慣性
        const targetVx = (dx / dist) * this.stats.speed;
        const targetVy = (dy / dist) * this.stats.speed;
        
        // 滑らかな加速（イージング）
        this.vx += (targetVx - this.vx) * 0.15;
        this.vy += (targetVy - this.vy) * 0.15;
      } else {
        // ターゲット付近では減速
        this.vx *= 0.8;
        this.vy *= 0.8;
      }
    } else {
      // 入力がない場合は摩擦で自然減速
      this.vx *= 0.92;
      this.vy *= 0.92;
    }

    // 座標更新
    this.x += this.vx;
    this.y += this.vy;

    // ワールド境界衝突（画面からはみ出さないように）
    this.x = Math.max(this.radius, Math.min(worldWidth - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(worldHeight - this.radius, this.y));

    // べん毛のアニメーションうねり計算
    if (this.stats.evolutions.includes('flagellum')) {
      const speedMag = Math.hypot(this.vx, this.vy);
      const wagSpeed = 0.5 + speedMag * 0.15; // 速度に応じてうねうねが速くなる
      this.tailAngle = Math.sin(this.animTimer * wagSpeed) * 0.45;
    }
  }

  // ダメージを受ける処理
  public takeDamage(amount: number): boolean {
    if (this.invincibilityTimer > 0) return false; // 無敵中はダメージを受けない
    
    // 防御力による軽減
    const reducedAmount = amount * (1 - this.stats.damageReduce);
    this.stats.hp = Math.max(0, this.stats.hp - Math.round(reducedAmount));
    return this.stats.hp <= 0; // 死亡したか
  }

  // 回復処理
  public heal(amount: number) {
    this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
  }

  // エネルギー（進化ポイント）獲得
  public addEnergy(amount: number): boolean {
    if (this.stats.energy >= this.stats.maxEnergy) return false;
    this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + amount);
    return this.stats.energy >= this.stats.maxEnergy; // 進化可能か
  }

  // --- 動的な Canvas レンダリング ---

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // 無敵時間中の点滅表現
    if (this.invincibilityTimer > 0) {
      if (Math.floor(Date.now() / 150) % 2 === 0) {
        ctx.globalAlpha = 0.25; // 半透明にして点滅を表現
      }
    }

    // 無敵時間中のネオン電磁バリアの描画（プレイヤー自身より少し大きい防護シールド）
    if (this.invincibilityTimer > 0) {
      ctx.save();
      // 残り時間に応じたスケール（残り1.5秒以下で徐々に収縮）
      let shieldScale = 1.0;
      if (this.invincibilityTimer < 1.5) {
        shieldScale = 0.4 + (this.invincibilityTimer / 1.5) * 0.6;
      }
      
      // バリアの点滅速度調整（残り時間が少なくなると警告として激しく明滅）
      const blinkSpeed = this.invincibilityTimer < 1.5 ? 70 : 180;
      const isVisible = Math.floor(Date.now() / blinkSpeed) % 2 === 0;
      
      if (isVisible) {
        ctx.beginPath();
        // 脈動するサイズ
        const pulse = Math.sin(Date.now() / 90) * 1.8;
        const shieldRadius = (this.radius + 12 + pulse) * shieldScale;
        ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
        
        // プレミアムなネオンシアンのグロー効果
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.95)'; // ネオンシアン
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.stroke();
        
        // 内側の淡いエネルギーグラデーション
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.fill();
        
        // 装飾的な外枠の回転ノッチ（電磁シールドのサイファイな表現）
        const notchCount = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = 0; // 重くならないようにシャドウを一旦リセット
        
        for (let i = 0; i < notchCount; i++) {
          const startAngle = (i * Math.PI * 2) / notchCount + (Date.now() / 900);
          ctx.beginPath();
          ctx.arc(0, 0, shieldRadius + 2.5, startAngle, startAngle + 0.45);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    const hasEvo = (id: string) => this.stats.evolutions.includes(id);

    // 1. べん毛の描画 (後ろにうねるしっぽ)
    if (hasEvo('flagellum')) {
      ctx.save();
      ctx.rotate(Math.PI + this.tailAngle); // 真後ろに向けてアニメーション回転

      ctx.beginPath();
      ctx.moveTo(this.radius * 0.8, 0);
      
      // 滑らかなベジェ曲線でしっぽを描画
      const tailLen = this.radius * 2.2;
      ctx.bezierCurveTo(
        tailLen * 0.4, tailLen * 0.25,
        tailLen * 0.7, -tailLen * 0.25,
        tailLen, 0
      );
      
      // 光るネオンべん毛
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.75)'; // シアン
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgb(6, 182, 212)';
      ctx.stroke();
      ctx.restore();
    }

    // 2. 両生四肢の描画 (手足)
    if (hasEvo('amphibious_limbs')) {
      ctx.save();
      const limbCycle = Math.sin(this.animTimer * 1.5) * 0.25;
      
      ctx.fillStyle = '#059669'; // 深いエメラルド
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgb(16, 185, 129)';

      // 4本の手足（動的に揺れる）
      // 前足(左・右)
      ctx.beginPath();
      ctx.ellipse(this.radius * 0.4, -this.radius * 0.9, this.radius * 0.35, this.radius * 0.6, Math.PI / 4 + limbCycle, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(this.radius * 0.4, this.radius * 0.9, this.radius * 0.35, this.radius * 0.6, -Math.PI / 4 - limbCycle, 0, Math.PI * 2);
      ctx.fill();

      // 後ろ足(左・右)
      ctx.beginPath();
      ctx.ellipse(-this.radius * 0.5, -this.radius * 0.8, this.radius * 0.25, this.radius * 0.5, -Math.PI / 6 + limbCycle, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-this.radius * 0.5, this.radius * 0.8, this.radius * 0.25, this.radius * 0.5, Math.PI / 6 - limbCycle, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 3. 防御トゲの描画
    if (hasEvo('spikes')) {
      ctx.save();
      ctx.strokeStyle = '#ef4444'; // 赤の刺
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ef4444';

      const spikeCount = 8;
      for (let i = 0; i < spikeCount; i++) {
        const theta = (i * Math.PI * 2) / spikeCount;
        ctx.beginPath();
        ctx.moveTo(Math.cos(theta) * this.radius, Math.sin(theta) * this.radius);
        ctx.lineTo(Math.cos(theta) * (this.radius + 12), Math.sin(theta) * (this.radius + 12));
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. キチン質外骨格または耐寒糖脂質シェルの描画 (アウターシールド)
    if (hasEvo('chitin_armor') || hasEvo('glycolipid_shell')) {
      ctx.save();
      ctx.beginPath();
      
      if (hasEvo('glycolipid_shell')) {
        // 水色のクリスタル多角形シールド
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.85)';
        ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
        ctx.shadowColor = 'rgb(14, 165, 233)';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 12;

        const sides = 6;
        for (let i = 0; i <= sides; i++) {
          const theta = (i * Math.PI * 2) / sides;
          const rx = (this.radius + 8) * Math.cos(theta);
          const ry = (this.radius + 8) * Math.sin(theta);
          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
      } else {
        // 茶色／琥珀色の重厚な多角形外骨格
        ctx.strokeStyle = '#d97706';
        ctx.fillStyle = 'rgba(217, 119, 6, 0.1)';
        ctx.shadowColor = '#d97706';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 6;

        const sides = 5;
        for (let i = 0; i <= sides; i++) {
          const theta = (i * Math.PI * 2) / sides;
          const rx = (this.radius + 6) * Math.cos(theta);
          const ry = (this.radius + 6) * Math.sin(theta);
          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 5. メイン細胞体またはカスタム画像の描画
    if (this.iconImage) {
      ctx.save();
      // PNG画像を円形にくり抜いて描画
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.clip();

      const hpRatio = this.stats.hp / this.stats.maxHp;
      
      // 画像を描画
      ctx.drawImage(this.iconImage, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
      
      // 瀕死の点滅エフェクト・赤いオーバーレイ
      if (hpRatio < 0.3) {
        const dangerBlink = Math.sin(this.animTimer * 4) * 0.15 + 0.15;
        ctx.fillStyle = `rgba(239, 68, 68, ${dangerBlink})`;
        ctx.fill();
      }

      ctx.restore();

      // 外側のグロー効果・枠線
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      
      if (hpRatio < 0.3) {
        const dangerBlink = Math.sin(this.animTimer * 4) * 0.2 + 0.6;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10 * dangerBlink;
      } else {
        // 各時代ごとに美しいネオングローカラーを変える
        let glowColor = 'rgba(16, 185, 129, 0.6)'; // デフォルト：グリーン（冥王代・始生代）
        if (hasEvo('proto_intelligence')) {
          glowColor = 'rgba(168, 85, 247, 0.7)'; // 新生代：パープル
        } else if (hasEvo('panoramic_eyes')) {
          glowColor = 'rgba(234, 179, 8, 0.7)'; // 中生代：ゴールド
        } else if (hasEvo('amphibious_limbs')) {
          glowColor = 'rgba(6, 182, 212, 0.7)'; // 古生代：シアン・ブルー
        } else if (hasEvo('oxygen_respiration')) {
          glowColor = 'rgba(14, 165, 233, 0.7)'; // 原生代：ライトブルー
        }
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 14 + Math.sin(this.animTimer * 1.5) * 4;
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    } else {
      // 従来の細胞体・核・眼点の描画
      // 5. メイン細胞体の描画
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);

      const hpRatio = this.stats.hp / this.stats.maxHp;
      let bodyGrad = ctx.createRadialGradient(0, 0, this.radius * 0.1, 0, 0, this.radius);
      
      if (hpRatio < 0.3) {
        const dangerBlink = Math.sin(this.animTimer * 4) * 0.2 + 0.6;
        bodyGrad.addColorStop(0, '#ef4444');
        bodyGrad.addColorStop(0.5, '#7f1d1d');
        bodyGrad.addColorStop(1, 'rgba(127, 29, 29, 0.3)');
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10 * dangerBlink;
      } else {
        bodyGrad.addColorStop(0, '#ffffff');
        bodyGrad.addColorStop(0.2, '#10b981');
        bodyGrad.addColorStop(0.7, '#047857');
        bodyGrad.addColorStop(1, 'rgba(6, 95, 70, 0.2)');
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 14 + Math.sin(this.animTimer * 1.5) * 4;
      }

      ctx.fillStyle = bodyGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 6. 核 (Nucleus) または 知性の脳組織の描画
      ctx.save();
      ctx.beginPath();
      if (hasEvo('proto_intelligence')) {
        ctx.arc(0, 0, this.radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fbbf24';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-this.radius * 0.3, -this.radius * 0.1);
        ctx.lineTo(0, this.radius * 0.2);
        ctx.lineTo(this.radius * 0.3, -this.radius * 0.25);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.arc(-this.radius * 0.15, -this.radius * 0.1, this.radius * 0.38, 0, Math.PI * 2);
        const nuGrad = ctx.createRadialGradient(
          -this.radius * 0.15, -this.radius * 0.1, 0,
          -this.radius * 0.15, -this.radius * 0.1, this.radius * 0.38
        );
        nuGrad.addColorStop(0, '#a855f7');
        nuGrad.addColorStop(1, '#6b21a8');
        ctx.fillStyle = nuGrad;
        ctx.fill();
      }
      ctx.restore();

      // 7. 感覚器官の描画（目・眼点）
      if (hasEvo('panoramic_eyes')) {
        ctx.save();
        const eyeOffset = this.radius * 0.5;
        const eyeRad = 7.5;
        const pupilRad = 3.5;

        [-1, 1].forEach(side => {
          ctx.save();
          ctx.translate(this.radius * 0.65, side * eyeOffset);

          ctx.beginPath();
          ctx.arc(0, 0, eyeRad, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(1.5, 0, pupilRad, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(2.0, 0, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#000000';
          ctx.fill();
          
          ctx.restore();
        });
        ctx.restore();
      } else if (hasEvo('chemotaxis')) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.radius * 0.8, -this.radius * 0.25, 3.5, 0, Math.PI * 2);
        ctx.arc(this.radius * 0.8, this.radius * 0.25, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ef4444';
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }
}
