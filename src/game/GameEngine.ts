import { Player } from './Player';
import { Food, Hazard, Predator } from './Entity';
import type { HazardType, PredatorType } from './Entity';
import type { EraType, ExtinctionEvent } from './types';
import { ERAS, EXTINCTION_EVENTS } from './constants';
import { sound } from './SoundGenerator';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  // ワールドサイズ (広大なスクロールエリア)
  public worldWidth = 2400;
  public worldHeight = 2400;
  
  // カメラ位置
  public cameraX = 1200;
  public cameraY = 1200;
  
  public player: Player;
  public foods: Food[] = [];
  public hazards: Hazard[] = [];
  public predators: Predator[] = [];

  // ゲーム状態
  public currentEra: EraType = 'HADEAN_ARCHEAN';
  public activeEvent: ExtinctionEvent | null = null;
  public eventTimer = 0; // 秒数
  public gameTime = 0; // 年代メーターの代わり (0 〜 100)
  public isPaused = false;
  
  // UI連携用コールバック
  private onEvolutionTrigger: () => void;
  private onGameOver: (score: number, reason: string) => void;
  private onEraChanged: (newEra: EraType) => void;
  private onEventStarted: (event: ExtinctionEvent) => void;
  private onEventEnded: () => void;

  // 入力状態
  private inputX = 1200;
  private inputY = 1200;
  private isInputActive = false;

  // 特殊演出用
  private screenShake = 0;
  private flashAlpha = 0;
  private flashColor = '#ffffff';

  // 時代ごとの進行カウンター
  public eraProgress = 0; // 0 〜 100 (進化を1回選択するごとに進む)
  private eventCooldown = 15; // イベント開始までの待機時間 (秒)
  private triggeredEventKeys = new Set<string>();

  constructor(
    canvas: HTMLCanvasElement,
    onEvolutionTrigger: () => void,
    onGameOver: (score: number, reason: string) => void,
    onEraChanged: (newEra: EraType) => void,
    onEventStarted: (event: ExtinctionEvent) => void,
    onEventEnded: () => void
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get Canvas 2D Context');
    this.ctx = context;

    this.onEvolutionTrigger = onEvolutionTrigger;
    this.onGameOver = onGameOver;
    this.onEraChanged = onEraChanged;
    this.onEventStarted = onEventStarted;
    this.onEventEnded = onEventEnded;

    this.player = new Player(this.worldWidth / 2, this.worldHeight / 2);
    this.player.loadIconImage(this.currentEra);
    this.inputX = this.worldWidth / 2;
    this.inputY = this.worldHeight / 2;

    this.initWorld();
  }

  // 初期ワールド生成
  private initWorld() {
    this.foods = [];
    this.hazards = [];
    this.predators = [];
    
    // 初回オブジェクト生成
    this.spawnFoods(40);
    this.spawnHazards(12);
  }

  // 新しくマウントされたCanvas要素とコンテキストを再バインドする (Reactのコンポーネント再生成対策)
  public rebindCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get Canvas 2D Context');
    this.ctx = context;
  }

  // 画面解像度アジャスト (Retina/高解像度ディスプレイ対応)
  public resize(width: number, height: number) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
  }

  // --- 入力ハンドリング ---

  public setInputPosition(screenX: number, screenY: number, isActive: boolean) {
    this.isInputActive = isActive;
    if (!isActive) return;

    // スクリーン座標からワールド座標への逆算
    const viewWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const viewHeight = this.canvas.height / (window.devicePixelRatio || 1);

    this.inputX = screenX + this.cameraX - viewWidth / 2;
    this.inputY = screenY + this.cameraY - viewHeight / 2;
  }

  // キーボード移動用 (差分ベクトル)
  public handleKeyboardInput(dx: number, dy: number) {
    this.isInputActive = true;
    this.inputX = this.player.x + dx * 200;
    this.inputY = this.player.y + dy * 200;
  }

  public releaseKeyboardInput() {
    this.isInputActive = false;
  }

  // --- ゲーム進行更新 ---

  public update(deltaTime: number) {
    if (this.isPaused) return;

    // 1. 特殊エフェクト減衰
    if (this.screenShake > 0) this.screenShake -= 0.1;
    if (this.flashAlpha > 0) this.flashAlpha -= 0.04;

    // プレイヤーの無敵時間を更新 (コンティニュー復活時の安全策)
    if (this.player.invincibilityTimer > 0) {
      this.player.invincibilityTimer = Math.max(0, this.player.invincibilityTimer - deltaTime);
    }

    // 2. プレイヤー更新
    this.player.update(this.inputX, this.inputY, this.isInputActive, this.worldWidth, this.worldHeight);

    // 3. カメラ追従 (プレイヤーを中心に滑らかにイージング)
    this.cameraX += (this.player.x - this.cameraX) * 0.08;
    this.cameraY += (this.player.y - this.cameraY) * 0.08;

    // 4. 環境要素更新 (スループ)
    this.updateEnvironment(deltaTime);

    // 5. エサ更新 & 衝突判定
    this.updateFoods();

    // 6. 障害物更新 & 衝突判定
    this.updateHazards();

    // 7. 捕食者更新 & 衝突判定
    this.updatePredators();

    // 8. 絶滅イベント監視
    this.updateEventMonitor(deltaTime);

    // 9. オブジェクト再充填
    this.replenishObjects();
  }

  // 環境ダメージ・回復計算
  private updateEnvironment(deltaTime: number) {
    if (this.player.invincibilityTimer > 0) return; // 無敵中は環境ダメージの計算自体を完全にスキップして安全を保証

    const era = ERAS[this.currentEra];
    const env = this.activeEvent ? {
      temperature: era.environment.temperature + this.activeEvent.tempChange,
      oxygen: era.environment.oxygen + this.activeEvent.oxyChange,
      toxicity: era.environment.toxicity + this.activeEvent.toxChange,
      hazard: era.environment.hazard + this.activeEvent.hazChange,
    } : era.environment;

    // 毎秒スリップダメージの計算 (フレームレート非依存にするため deltaTime 換算)
    const tickDamageBase = 22 * deltaTime; // 秒間基本ダメージスケール
    let slipDamage = 0;

    // A. 熱ダメージ (耐熱が足りない場合)
    if (env.temperature > 45) {
      const heatDiff = env.temperature - this.player.stats.heatResist;
      if (heatDiff > 0) {
        slipDamage += (heatDiff / 100) * tickDamageBase;
      }
    }

    // B. 寒さダメージ (耐寒が足りない場合)
    if (env.temperature < 0) {
      const coldDiff = Math.abs(env.temperature) - this.player.stats.coldResist;
      if (coldDiff > 0) {
        slipDamage += (coldDiff / 100) * tickDamageBase;
      }
    }

    // C. 毒ダメージ
    if (env.toxicity > 20) {
      const toxDiff = env.toxicity - (this.player.stats.damageReduce * 100);
      if (toxDiff > 0) {
        slipDamage += (toxDiff / 120) * tickDamageBase * 0.5;
      }
    }

    // D. 酸素エリアでの挙動
    // 原生代の大酸化イベント中、酸素呼吸未所持なら猛毒スリップ、所持なら回復
    if (this.activeEvent?.requiredEvolution === 'oxygen_respiration') {
      if (!this.player.stats.oxygenBenefit) {
        slipDamage += tickDamageBase * 1.5; // 大ダメージ
      } else {
        this.player.heal(tickDamageBase * 0.8); // 回復！
      }
    }

    // 算出ダメージ適用
    if (slipDamage > 0) {
      const isDead = this.player.takeDamage(slipDamage);
      if (isDead) {
        this.triggerGameOver('環境適応に失敗し、自然淘汰されました。');
      }
    }
  }

  // 絶滅イベント監視・発生
  private updateEventMonitor(deltaTime: number) {
    if (this.activeEvent) {
      // イベント進行
      this.eventTimer -= deltaTime;
      this.screenShake = Math.max(this.screenShake, this.activeEvent.hazChange * 0.05); // 危険度に応じた揺れ

      if (this.eventTimer <= 0) {
        // イベント終了
        this.activeEvent = null;
        this.onEventEnded();
        this.eventCooldown = 25 + Math.random() * 15; // 次回までのインターバル
        
        // 終了時フラッシュ効果 (緑)
        this.flashAlpha = 0.6;
        this.flashColor = 'rgba(16, 185, 129, 0.4)';

        // 時代進行条件を満たしている場合でも、未発生イベントが残っていれば時代遷移を待つ。
        if (this.eraProgress >= 100 && !this.getNextRequiredEventKey(this.currentEra)) {
          this.transitionToNextEra();
        }
      }
      return;
    }

    // クールダウン消化
    if (this.eventCooldown > 0) {
      this.eventCooldown -= deltaTime;
      return;
    }

    // その時代で未発生のイベントが残っている間は、確率ではなく必ず順番に発生させる。
    const nextRequiredEventKey = this.getNextRequiredEventKey(this.currentEra);
    if (nextRequiredEventKey) {
      this.triggerEvent(nextRequiredEventKey);
      return;
    }

    // 全イベント発生後は従来通り、確率で追加イベントを発生させる。
    const prob = ERAS[this.currentEra].eventProbability;
    if (Math.random() < prob * deltaTime) {
      this.triggerEvent();
    }
  }

  private getRequiredEventKeys(era: EraType) {
    switch (era) {
      case 'PROTEROZOIC':
        return ['GREAT_OXIDATION', 'SNOWBALL_EARTH'];
      case 'PALEOZOIC':
        return ['CAMBRIAN_EXPLOSION', 'PERMIAN_EXTINCTION'];
      case 'MESOZOIC':
        return ['METEOR_IMPACT'];
      case 'CENOZOIC':
        return ['GLACIAL_CYCLE'];
      default:
        return [];
    }
  }

  private getNextRequiredEventKey(era: EraType) {
    return this.getRequiredEventKeys(era).find(eventKey => !this.triggeredEventKeys.has(eventKey));
  }

  // 絶滅イベントのトリガー
  private triggerEvent(forcedEventKey?: string) {
    let eventKey = forcedEventKey || '';
    
    if (!eventKey) {
      const eventKeys = this.getRequiredEventKeys(this.currentEra);
      if (eventKeys.length === 0) return; // 冥王代・始生代はイベントなし
      eventKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
    }

    const event = EXTINCTION_EVENTS[eventKey];
    if (!event) return;

    this.activeEvent = event;
    this.eventTimer = event.duration;
    this.triggeredEventKeys.add(eventKey);
    this.onEventStarted(event);

    sound.playExtinctionWarning();

    // 発生フラッシュ効果 (赤)
    this.screenShake = 6.0;
    this.flashAlpha = 0.8;
    this.flashColor = 'rgba(239, 68, 68, 0.45)';
  }

  // プレイヤー死亡時
  private triggerGameOver(reason: string) {
    this.isPaused = true;
    sound.stopAll();
    sound.playGameOver();
    this.onGameOver(this.player.stats.score, reason);
  }

  // コンティニュー時の復活処理 (HP全回復、3.5秒無敵、周囲の敵の遠隔リスポーン)
  public continueGame() {
    // 1. HP全回復
    this.player.stats.hp = this.player.stats.maxHp;
    
    // 2. 5.5秒の無敵時間を付与 (安全確保)
    this.player.invincibilityTimer = 5.5;
    
    // 3. 復活の祝福フラッシュ (ネオンシアン) & 画面揺れ
    this.flashAlpha = 0.8;
    this.flashColor = 'rgba(6, 182, 212, 0.4)';
    this.screenShake = 4.0;

    // プレイヤーの移動速度（慣性）を完全にリセットし、復活直後の滑り事故を防ぐ
    this.player.vx = 0;
    this.player.vy = 0;

    // 4. 周囲500px以内の捕食者を安全のために遠隔リスポーン
    this.predators.forEach(pred => {
      const dist = Math.hypot(pred.x - this.player.x, pred.y - this.player.y);
      if (dist < 500) {
        const { x, y } = this.getRandomPositionFarFromPlayer(500);
        pred.x = x;
        pred.y = y;
        pred.vx = 0;
        pred.vy = 0;
      }
    });

    // 5. 周囲400px以内の障害物（溶岩・ガス・氷）も安全のために遠隔リスポーン
    this.hazards.forEach(hazard => {
      const dist = Math.hypot(hazard.x - this.player.x, hazard.y - this.player.y);
      if (dist < 400) {
        const { x, y } = this.getRandomPositionFarFromPlayer(400);
        hazard.x = x;
        hazard.y = y;
      }
    });

    // 6. 一時停止を解除
    this.isPaused = false;
  }

  // --- 進化実行と時代遷移 ---

  // プレイヤーが進化選択を終えた時にUIから呼ばれる
  public completeEvolution(evolutionId: string) {
    this.player.evolve(evolutionId);
    this.player.stats.energy = 0; // エネルギーリセット
    sound.playEvolution();
    
    // 進化完了時の祝福フラッシュ
    this.flashAlpha = 0.75;
    this.flashColor = 'rgba(251, 191, 36, 0.5)'; // 金色
    
    this.eraProgress += 50; // 進化2回で時代が次のフェーズへ

    if (this.eraProgress >= 100) {
      if (this.getNextRequiredEventKey(this.currentEra)) {
        this.eventCooldown = 0;
        this.isPaused = false;
        sound.resume();
      } else {
        this.transitionToNextEra();
      }
    } else {
      this.isPaused = false;
      sound.resume();
    }
  }

  // 次の時代へシフト
  private transitionToNextEra() {
    this.eraProgress = 0;
    
    const eraOrder: EraType[] = ['HADEAN_ARCHEAN', 'PROTEROZOIC', 'PALEOZOIC', 'MESOZOIC', 'CENOZOIC'];
    const currentIdx = eraOrder.indexOf(this.currentEra);
    
    if (currentIdx === eraOrder.length - 1) {
      // 最終時代（新生代）の完了 ➔ ゲームクリア！
      this.isPaused = true;
      sound.stopAll();
      sound.playGameClear();
      this.onGameOver(this.player.stats.score + 5000, '祝！人類への究極進化を遂げ、46億年の旅を制覇しました！');
    } else {
      const nextEra = eraOrder[currentIdx + 1];
      this.currentEra = nextEra;
      this.eventCooldown = this.getRequiredEventKeys(nextEra).length > 0 ? 8 : 15;
      this.player.loadIconImage(nextEra);
      sound.setEra(nextEra);
      this.onEraChanged(nextEra);
      
      // ワールドリフレッシュ
      this.initWorld();
      
      this.isPaused = false;
      sound.resume();

      // 時代シフトフラッシュ (青・緑)
      this.flashAlpha = 0.8;
      this.flashColor = 'rgba(6, 182, 212, 0.5)'; // シアン
    }
  }

  // --- エンティティ管理 ---

  private updateFoods() {
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const food = this.foods[i];
      food.update(this.worldWidth, this.worldHeight);

      // プレイヤーとの衝突判定
      const dist = Math.hypot(food.x - this.player.x, food.y - this.player.y);
      if (dist < this.player.radius + food.radius) {
        // 捕食
        const isEvoTriggered = this.player.addEnergy(food.energyValue);
        this.player.stats.score += food.type === 'dna' ? 250 : 50;
        
        if (food.type === 'dna') {
          sound.playEatDna();
        } else {
          sound.playEatFood();
        }

        // 消去
        this.foods.splice(i, 1);

        // 進化トリガー
        if (isEvoTriggered) {
          this.isPaused = true;
          this.onEvolutionTrigger();
        }
      }
    }
  }

  private updateHazards() {
    for (const hazard of this.hazards) {
      hazard.update();

      const dist = Math.hypot(hazard.x - this.player.x, hazard.y - this.player.y);
      if (dist < this.player.radius + hazard.radius) {
        // スリップダメージ
        let dmg = hazard.damage;
        
        // 耐性によるダメージ軽減
        if (hazard.type === 'lava') {
          dmg *= (1 - this.player.stats.heatResist / 100);
        } else if (hazard.type === 'ice_crystal') {
          dmg *= (1 - this.player.stats.coldResist / 100);
        }

        const isDead = this.player.takeDamage(dmg);
        this.screenShake = Math.max(this.screenShake, 1.2);
        
        // 10フレームに1回ダメージ効果音
        if (Math.random() < 0.1) {
          sound.playDamage();
        }

        if (isDead) {
          this.triggerGameOver(`${hazard.type === 'lava' ? 'マグマ・熱水' : hazard.type === 'toxic' ? '有毒気泡' : '氷結晶'}に飲み込まれ、生存競争に敗れました。`);
          break;
        }
      }
    }
  }

  private updatePredators() {
    for (let i = this.predators.length - 1; i >= 0; i--) {
      const pred = this.predators[i];
      pred.update(this.player, this.worldWidth, this.worldHeight);

      // 死滅（足踏み去りなど）
      if (pred.hp <= 0) {
        this.predators.splice(i, 1);
        continue;
      }

      const dist = Math.hypot(pred.x - this.player.x, pred.y - this.player.y);
      if (dist < this.player.radius + pred.radius) {
        // 接触！
        if (this.player.stats.spikes > 0 && pred.type !== 'dinosaur_shadow') {
          // トゲのカウンター
          pred.takeCounterDamage(this.player.stats.spikes);
          sound.playDamage();
          this.screenShake = 3.0;

          if (pred.hp <= 0) {
            // カウンターで敵を撃破！
            this.player.stats.score += 500;
            this.predators.splice(i, 1);
            
            // 撃破フラッシュ
            this.flashAlpha = 0.45;
            this.flashColor = '#ef4444';
            continue;
          }
        }

        // プレイヤーへの大ダメージ
        const isDead = this.player.takeDamage(pred.damage);
        this.screenShake = Math.max(this.screenShake, 5.0);
        sound.playDamage();

        if (isDead) {
          const names: Record<PredatorType, string> = {
            virus: '原始ウイルス',
            anomalocaris: 'カンブリアの絶対捕食者アノマロカリス',
            dinosaur_shadow: '巨大恐竜の踏みつけ',
            sabertooth: '高速サーベルタイガー'
          };
          this.triggerGameOver(`${names[pred.type]}に捕食され、種が絶滅しました。`);
          break;
        }

        // 被弾後、ノックバック
        const knockAngle = Math.atan2(this.player.y - pred.y, this.player.x - pred.x);
        this.player.vx = Math.cos(knockAngle) * 8.0;
        this.player.vy = Math.sin(knockAngle) * 8.0;
      }
    }
  }

  // スポーン・再充填
  private replenishObjects() {
    // A. エサの再充填
    if (this.foods.length < 35) {
      this.spawnFoods(1);
    }

    // B. 障害物の再充填
    if (this.hazards.length < 10) {
      this.spawnHazards(1);
    }

    // C. 捕食者の再充填
    let maxPredators = 2;
    if (this.currentEra === 'PALEOZOIC') maxPredators = 3;
    if (this.currentEra === 'MESOZOIC' || this.currentEra === 'CENOZOIC') maxPredators = 4;
    
    // イベント中は危険度アップで敵が増大
    if (this.activeEvent) maxPredators += 2;

    if (this.predators.length < maxPredators) {
      this.spawnPredator();
    }
  }

  // --- スポーン実装 ---

  private spawnFoods(count: number) {
    for (let i = 0; i < count; i++) {
      const { x, y } = this.getRandomPositionFarFromPlayer(150);
      const isDna = Math.random() < 0.15; // 15%でDNA
      this.foods.push(new Food(x, y, isDna ? 'dna' : 'nutrient'));
    }
  }

  private spawnHazards(count: number) {
    for (let i = 0; i < count; i++) {
      const { x, y } = this.getRandomPositionFarFromPlayer(200);
      
      let type: HazardType = 'toxic';
      
      if (this.currentEra === 'HADEAN_ARCHEAN') {
        type = 'lava';
      } else if (this.activeEvent?.name === 'Snowball Earth' || this.currentEra === 'CENOZOIC') {
        type = 'ice_crystal';
      } else if (this.currentEra === 'PROTEROZOIC') {
        type = 'toxic';
      } else {
        const r = Math.random();
        type = r < 0.4 ? 'toxic' : r < 0.7 ? 'ice_crystal' : 'lava';
      }

      this.hazards.push(new Hazard(x, y, type));
    }
  }

  private spawnPredator() {
    const { x, y } = this.getRandomPositionFarFromPlayer(350);
    
    let type: PredatorType = 'virus';
    
    if (this.currentEra === 'HADEAN_ARCHEAN') {
      type = 'virus';
    } else if (this.currentEra === 'PROTEROZOIC') {
      type = 'virus';
    } else if (this.currentEra === 'PALEOZOIC') {
      type = 'anomalocaris';
    } else if (this.currentEra === 'MESOZOIC') {
      type = Math.random() < 0.7 ? 'dinosaur_shadow' : 'anomalocaris';
    } else if (this.currentEra === 'CENOZOIC') {
      type = 'sabertooth';
    }

    if (type === 'dinosaur_shadow') {
      const angle = this.player.angle;
      const leadDist = 180 + Math.random() * 100;
      const px = this.player.x + Math.cos(angle) * leadDist;
      const py = this.player.y + Math.sin(angle) * leadDist;
      
      this.predators.push(new Predator(px, py, 'dinosaur_shadow'));
    } else {
      this.predators.push(new Predator(x, y, type));
    }
  }

  // プレイヤーの近くには湧かせない安全処理
  private getRandomPositionFarFromPlayer(minDist: number): { x: number; y: number } {
    let px = 0;
    let py = 0;
    let attempts = 0;
    
    do {
      px = Math.random() * (this.worldWidth - 100) + 50;
      py = Math.random() * (this.worldHeight - 100) + 50;
      attempts++;
    } while (Math.hypot(px - this.player.x, py - this.player.y) < minDist && attempts < 100);

    return { x: px, y: py };
  }

  // --- メインレンダリングループ ---

  public render() {
    const viewWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const viewHeight = this.canvas.height / (window.devicePixelRatio || 1);

    this.ctx.clearRect(0, 0, viewWidth, viewHeight);

    this.ctx.save();
    
    let shakeX = 0;
    let shakeY = 0;
    if (this.screenShake > 0) {
      shakeX = (Math.random() - 0.5) * this.screenShake * 2.0;
      shakeY = (Math.random() - 0.5) * this.screenShake * 2.0;
    }

    this.ctx.translate(
      Math.floor(-this.cameraX + viewWidth / 2 + shakeX),
      Math.floor(-this.cameraY + viewHeight / 2 + shakeY)
    );

    this.drawBackgroundGrid(viewWidth, viewHeight);
    this.drawEnvironmentAreas();

    for (const food of this.foods) {
      food.draw(this.ctx);
    }

    for (const hazard of this.hazards) {
      hazard.draw(this.ctx);
    }

    for (const pred of this.predators) {
      if (pred.type === 'dinosaur_shadow') {
        pred.draw(this.ctx, this.player);
      }
    }

    this.player.draw(this.ctx);

    for (const pred of this.predators) {
      if (pred.type !== 'dinosaur_shadow') {
        pred.draw(this.ctx, this.player);
      }
    }

    this.drawWorldBoundaries();

    if (this.player.stats.evolutions.includes('chemotaxis')) {
      this.drawSensorArrows();
    }

    this.ctx.restore();

    if (this.flashAlpha > 0) {
      this.ctx.fillStyle = this.flashColor;
      this.ctx.globalAlpha = this.flashAlpha;
      this.ctx.fillRect(0, 0, viewWidth, viewHeight);
      this.ctx.globalAlpha = 1.0;
    }
  }

  // ネオン背景グリッド
  private drawBackgroundGrid(viewWidth: number, viewHeight: number) {
    this.ctx.save();
    
    let gridColor = 'rgba(6, 182, 212, 0.05)';
    if (this.currentEra === 'HADEAN_ARCHEAN') gridColor = 'rgba(239, 68, 68, 0.04)';
    else if (this.currentEra === 'PROTEROZOIC') gridColor = 'rgba(14, 165, 233, 0.05)';
    else if (this.currentEra === 'PALEOZOIC') gridColor = 'rgba(16, 185, 129, 0.06)';
    else if (this.currentEra === 'MESOZOIC') gridColor = 'rgba(234, 179, 8, 0.05)';
    else if (this.currentEra === 'CENOZOIC') gridColor = 'rgba(168, 85, 247, 0.06)';

    this.ctx.strokeStyle = gridColor;
    this.ctx.lineWidth = 1;

    const gridSize = 100;
    
    const startX = Math.max(0, Math.floor((this.cameraX - viewWidth / 2) / gridSize) * gridSize);
    const endX = Math.min(this.worldWidth, Math.ceil((this.cameraX + viewWidth / 2) / gridSize) * gridSize);
    const startY = Math.max(0, Math.floor((this.cameraY - viewHeight / 2) / gridSize) * gridSize);
    const endY = Math.min(this.worldHeight, Math.ceil((this.cameraY + viewHeight / 2) / gridSize) * gridSize);

    for (let x = startX; x <= endX; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
      this.ctx.stroke();
    }

    for (let y = startY; y <= endY; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private drawEnvironmentAreas() {
    if (this.currentEra === 'HADEAN_ARCHEAN') {
      this.ctx.save();
      const vents = [
        { x: 600, y: 600, r: 250 },
        { x: 1800, y: 800, r: 300 },
        { x: 1000, y: 1700, r: 280 }
      ];

      for (const vent of vents) {
        let grad = this.ctx.createRadialGradient(vent.x, vent.y, 0, vent.x, vent.y, vent.r);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.12)');
        grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.04)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(vent.x, vent.y, vent.r, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }

  private drawWorldBoundaries() {
    this.ctx.save();
    
    this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
    this.ctx.lineWidth = 6;
    this.ctx.shadowColor = '#06b6d4';
    this.ctx.shadowBlur = 15;
    
    this.ctx.strokeRect(0, 0, this.worldWidth, this.worldHeight);
    
    this.ctx.restore();
  }

  private drawSensorArrows() {
    if (this.foods.length === 0) return;

    this.ctx.save();
    
    let closestFood: Food | null = null;
    let minDist = this.player.stats.sensor;

    for (const food of this.foods) {
      const dist = Math.hypot(food.x - this.player.x, food.y - this.player.y);
      if (dist < minDist) {
        minDist = dist;
        closestFood = food;
      }
    }

    if (closestFood) {
      const dx = closestFood.x - this.player.x;
      const dy = closestFood.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist > this.player.radius * 3) {
        const arrowAngle = Math.atan2(dy, dx);
        const distFromPlayer = this.player.radius + 18;
        const ax = this.player.x + Math.cos(arrowAngle) * distFromPlayer;
        const ay = this.player.y + Math.sin(arrowAngle) * distFromPlayer;

        this.ctx.translate(ax, ay);
        this.ctx.rotate(arrowAngle);

        this.ctx.beginPath();
        this.ctx.moveTo(6, 0);
        this.ctx.lineTo(-4, -5);
        this.ctx.lineTo(-2, 0);
        this.ctx.lineTo(-4, 5);
        this.ctx.closePath();

        this.ctx.fillStyle = closestFood.type === 'dna' ? '#fbbf24' : '#22d3ee';
        this.ctx.shadowColor = closestFood.type === 'dna' ? '#a855f7' : '#06b6d4';
        this.ctx.shadowBlur = 6;
        this.ctx.fill();
      }
    }

    this.ctx.restore();
  }
}
