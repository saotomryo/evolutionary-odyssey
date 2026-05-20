import { Player } from './Player';

export type FoodType = 'nutrient' | 'dna';
export type HazardType = 'lava' | 'toxic' | 'ice_crystal';
export type PredatorType = 'virus' | 'anomalocaris' | 'dinosaur_shadow' | 'sabertooth';

export class Food {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public radius: number;
  public type: FoodType;
  public energyValue: number;
  private animTimer: number;

  constructor(x: number, y: number, type: FoodType = 'nutrient') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = type === 'dna' ? 7 : 5;
    this.energyValue = type === 'dna' ? 25 : 8; // DNAはエネルギー効率が高い
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.animTimer = Math.random() * 100;
  }

  public update(worldWidth: number, worldHeight: number) {
    this.animTimer += 0.05;
    
    // 微小な浮遊運動
    this.x += this.vx + Math.sin(this.animTimer) * 0.05;
    this.y += this.vy + Math.cos(this.animTimer) * 0.05;

    // 画面端で跳ね返り
    if (this.x < this.radius || this.x > worldWidth - this.radius) this.vx *= -1;
    if (this.y < this.radius || this.y > worldHeight - this.radius) this.vy *= -1;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + Math.sin(this.animTimer * 2) * 0.8, 0, Math.PI * 2);

    if (this.type === 'dna') {
      // DNA: ネオンパープル・ゴールドの二重発光
      ctx.fillStyle = '#fbbf24'; // ゴールドコア
      ctx.shadowColor = '#a855f7'; // パープルオーラ
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    } else {
      // 通常栄養素: ネオンシアン/グリーンの浮遊核
      ctx.fillStyle = '#22d3ee'; // シアンコア
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    ctx.restore();
  }
}

export class Hazard {
  public x: number;
  public y: number;
  public radius: number;
  public type: HazardType;
  public damage: number;
  private animTimer = Math.random() * 100;

  constructor(x: number, y: number, type: HazardType) {
    this.x = x;
    this.y = y;
    this.type = type;
    
    if (type === 'lava') {
      this.radius = 35;
      this.damage = 1.5; // スリップダメージ
    } else if (type === 'toxic') {
      this.radius = 20;
      this.damage = 0.8;
    } else {
      this.radius = 16;
      this.damage = 1.0;
    }
  }

  public update() {
    this.animTimer += 0.02;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    if (this.type === 'lava') {
      // 沸騰する熱水・溶岩噴出孔 (赤・オレンジの発光サークル)
      const pulseRadius = this.radius + Math.sin(this.animTimer * 2) * 4;
      let grad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, pulseRadius);
      grad.addColorStop(0, '#f97316'); // オレンジ
      grad.addColorStop(0.6, '#ef4444'); // 赤
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // 中心部（コア）
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a'; // イエロー発光
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 15;
      ctx.fill();
    } 
    else if (this.type === 'toxic') {
      // 有毒ガス気泡 (怪しく蠢く紫の泡)
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.animTimer);
      
      ctx.beginPath();
      const sides = 6;
      ctx.moveTo(this.radius, 0);
      for (let i = 1; i <= sides; i++) {
        const theta = (i * Math.PI * 2) / sides;
        // 少し形状をゆがめる
        const r = this.radius + Math.sin(this.animTimer * 3 + i) * 2;
        ctx.lineTo(Math.cos(theta) * r, Math.sin(theta) * r);
      }
      ctx.closePath();

      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.stroke();

      // 泡の内側のコア
      ctx.beginPath();
      ctx.arc(-3, -3, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      ctx.restore();
    } 
    else if (this.type === 'ice_crystal') {
      // 凍結氷結晶 (鋭利な氷の結晶、水色)
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.animTimer * 0.5);

      ctx.beginPath();
      ctx.moveTo(0, -this.radius);
      ctx.lineTo(this.radius * 0.4, -this.radius * 0.4);
      ctx.lineTo(this.radius, 0);
      ctx.lineTo(this.radius * 0.4, this.radius * 0.4);
      ctx.lineTo(0, this.radius);
      ctx.lineTo(-this.radius * 0.4, this.radius * 0.4);
      ctx.lineTo(-this.radius, 0);
      ctx.lineTo(-this.radius * 0.4, -this.radius * 0.4);
      ctx.closePath();

      ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }
}

export class Predator {
  public x: number;
  public y: number;
  public vx = 0;
  public vy = 0;
  public speed: number;
  public radius: number;
  public type: PredatorType;
  public damage: number;
  public hp = 100;
  private animTimer = Math.random() * 100;
  private angle = 0;

  // 恐竜の踏みつけ影用のステート
  public stompScale = 3.0; // 最初は上空にいるので巨大
  public isStomping = false;
  private stompTime = 0;

  constructor(x: number, y: number, type: PredatorType) {
    this.x = x;
    this.y = y;
    this.type = type;

    switch (type) {
      case 'virus':
        this.radius = 12;
        this.speed = 1.8;
        this.damage = 15;
        this.hp = 15;
        break;
      case 'anomalocaris':
        this.radius = 32;
        this.speed = 2.4;
        this.damage = 30;
        this.hp = 120;
        break;
      case 'dinosaur_shadow':
        this.radius = 45; // 踏みつけ範囲
        this.speed = 0.5;
        this.damage = 50;
        this.isStomping = true;
        break;
      case 'sabertooth':
        this.radius = 22;
        this.speed = 3.2;
        this.damage = 25;
        this.hp = 60;
        break;
    }
  }

  public update(player: Player, worldWidth: number, worldHeight: number) {
    this.animTimer += 0.08;

    if (this.type === 'dinosaur_shadow') {
      // 恐竜の踏みつけ処理 (上空から降下して踏みつける)
      this.stompTime += 0.02;
      if (this.stompTime < 1.5) {
        // 影が収束していく (上空から降下中)
        this.stompScale = 3.0 - (this.stompTime / 1.5) * 2.0; // 3.0 -> 1.0
        // プレイヤーの少し先を狙って緩やかに追尾
        this.x += (player.x - this.x) * 0.02;
        this.y += (player.y - this.y) * 0.02;
      } else if (this.stompTime < 2.2) {
        // 踏みつけ中！ (影が最も濃く、攻撃判定発生)
        this.stompScale = 1.0;
      } else {
        // 去っていく (踏み終わって足が上がる)
        this.stompScale = 1.0 + (this.stompTime - 2.2) * 2.5;
        if (this.stompTime > 3.0) {
          // 踏みつけ完了、消滅フラグはエンジン側で回収
          this.hp = 0; 
        }
      }
      return;
    }

    // --- AI追跡挙動 ---
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    // プレイヤーが擬態能力を持っている場合、捕食者の感知範囲を縮小
    let detectRange = 380;
    if (player.stats.evolutions.includes('chromatophores')) {
      detectRange = 160; // 擬態による感知困難化
    }

    if (dist < detectRange) {
      // プレイヤーを感知して追跡
      const targetVx = (dx / dist) * this.speed;
      const targetVy = (dy / dist) * this.speed;

      this.vx += (targetVx - this.vx) * 0.08;
      this.vy += (targetVy - this.vy) * 0.08;
    } else {
      // 感知範囲外：ランダム巡回（ゆるい浮遊）
      this.vx += (Math.sin(this.animTimer * 0.3) * 0.1 - this.vx) * 0.05;
      this.vy += (Math.cos(this.animTimer * 0.3) * 0.1 - this.vy) * 0.05;
    }

    this.x += this.vx;
    this.y += this.vy;

    // ワールド制限
    this.x = Math.max(this.radius, Math.min(worldWidth - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(worldHeight - this.radius, this.y));

    if (this.vx !== 0 || this.vy !== 0) {
      this.angle = Math.atan2(this.vy, this.vx);
    }
  }

  // トゲによるカウンターダメージ処理
  public takeCounterDamage(amount: number) {
    this.hp -= amount;
    // 被弾時は逆方向に少しノックバック
    this.vx *= -1.5;
    this.vy *= -1.5;
  }

  public draw(ctx: CanvasRenderingContext2D, player: Player) {
    // プレイヤーが「知性」の進化を持っている場合、敵の進路予測ベクトル（ガイドライン）を表示
    if (player.stats.evolutions.includes('proto_intelligence') && this.type !== 'dinosaur_shadow') {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      // 40フレーム先の未来位置を予測描画
      ctx.lineTo(this.x + this.vx * 35, this.y + this.vy * 35);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([5, 5]); // 点線
      ctx.stroke();

      // 予測到達地点のターゲットサークル
      ctx.beginPath();
      ctx.arc(this.x + this.vx * 35, this.y + this.vy * 35, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.restore();
    }

    ctx.save();

    if (this.type === 'dinosaur_shadow') {
      // 恐竜の踏みつけ (巨大な爪の影と落下)
      ctx.save();
      const isFootActive = this.stompTime >= 1.5 && this.stompTime < 2.2;
      
      // 地上の影の描画
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius * this.stompScale, this.radius * 0.7 * this.stompScale, 0, 0, Math.PI * 2);
      ctx.fillStyle = isFootActive 
        ? 'rgba(239, 68, 68, 0.35)' // 踏みつけ時は赤く光る
        : 'rgba(0, 0, 0, 0.45)';
      ctx.shadowColor = isFootActive ? '#ef4444' : '#000000';
      ctx.shadowBlur = isFootActive ? 20 : 5;
      ctx.fill();

      // 踏みつけ中の場合のみ、巨大な恐竜の足の実体を描画
      if (this.stompTime >= 1.3 && this.stompTime < 2.5) {
        const fallOffset = Math.max(0, (1.5 - this.stompTime) * 350); // 上空からの高さ
        ctx.translate(this.x, this.y - fallOffset);
        
        ctx.beginPath();
        // 巨大な爬虫類の3本の鋭い爪を描画
        ctx.moveTo(0, this.radius * 0.3);
        ctx.lineTo(-this.radius * 0.8, -this.radius * 0.5);
        ctx.lineTo(-this.radius * 0.3, -this.radius * 0.1);
        ctx.lineTo(0, -this.radius * 0.7); // 中央の爪
        ctx.lineTo(this.radius * 0.3, -this.radius * 0.1);
        ctx.lineTo(this.radius * 0.8, -this.radius * 0.5);
        ctx.closePath();

        ctx.fillStyle = '#1e293b'; // 暗いダークグレー
        ctx.strokeStyle = isFootActive ? '#ef4444' : '#475569';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
      return;
    }

    // 通常の敵の描画（位置と角度に合わせる）
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.type === 'virus') {
      // 原始ウイルス (角ばった赤紫の発光体。トゲトゲしている)
      ctx.beginPath();
      const spikes = 10;
      for (let i = 0; i < spikes; i++) {
        const angle = (i * Math.PI * 2) / spikes;
        const dist = i % 2 === 0 ? this.radius : this.radius * 0.5;
        const rx = Math.cos(angle) * dist;
        const ry = Math.sin(angle) * dist;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.fillStyle = '#ec4899'; // ネオンピンク
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 8;
      ctx.fill();
    } 
    else if (this.type === 'anomalocaris') {
      // カンブリアの絶対王者：アノマロカリス
      // エビのような節のある体、扇状の尾、前方に這う一対の巨大触手
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;

      // 1. 体の節の描画 (後ろから前へ重ねて描く)
      ctx.fillStyle = '#991b1b'; // デフォルトの甲殻類赤
      for (let i = 3; i >= 0; i--) {
        const segX = -i * (this.radius * 0.4);
        const segRad = this.radius * (1 - i * 0.15);
        ctx.beginPath();
        ctx.ellipse(segX, 0, segRad * 0.6, segRad * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2. 扇状の尾びれ (一番後ろ)
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.moveTo(-this.radius * 1.5, 0);
      ctx.lineTo(-this.radius * 2.2, -this.radius * 0.7);
      ctx.lineTo(-this.radius * 2.0, 0);
      ctx.lineTo(-this.radius * 2.2, this.radius * 0.7);
      ctx.closePath();
      ctx.fill();

      // 3. 前方の巨大触手 (うねうね動く)
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 4;
      const tentacleAnim = Math.sin(this.animTimer * 1.8) * 0.3;

      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(this.radius * 0.4, side * (this.radius * 0.3));
        ctx.bezierCurveTo(
          this.radius * 1.2, side * (this.radius * 0.9 + tentacleAnim * 10),
          this.radius * 1.8, side * (this.radius * 0.2 - tentacleAnim * 5),
          this.radius * 2.2, side * (this.radius * 0.4)
        );
        ctx.stroke();
      });

      // 4. 左右に突き出た柄のある眼 (巨大な複眼)
      ctx.fillStyle = '#f43f5e';
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.ellipse(this.radius * 0.1, side * (this.radius * 0.9), 6, 8, side * Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.radius * 0.1 + 2, side * (this.radius * 0.9), 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    } 
    else if (this.type === 'sabertooth') {
      // 新生代の捕食者（サーベルタイガー風）
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      
      // 胴体 (オレンジ色の筋肉質な流線型)
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.radius * 1.1, this.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 頭部
      ctx.beginPath();
      ctx.arc(this.radius * 0.8, 0, this.radius * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = '#78350f';
      ctx.fill();

      // 2本の巨大な牙 (鋭い白)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(this.radius * 1.0, side * (this.radius * 0.2));
        ctx.bezierCurveTo(
          this.radius * 1.4, side * (this.radius * 0.4),
          this.radius * 1.5, side * (this.radius * 0.6),
          this.radius * 1.6, side * (this.radius * 0.4)
        );
        ctx.stroke();
      });

      // 輝く琥珀の眼
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(this.radius * 1.0, -this.radius * 0.2, 2.5, 0, Math.PI * 2);
      ctx.arc(this.radius * 1.0, this.radius * 0.2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
