export type GameState = 'MENU' | 'PLAYING' | 'EVOLVING' | 'GAMEOVER' | 'GALLERY' | 'INTRO';

export type EraType = 'HADEAN_ARCHEAN' | 'PROTEROZOIC' | 'PALEOZOIC' | 'MESOZOIC' | 'CENOZOIC';

export interface Era {
  type: EraType;
  name: string;
  japaneseName: string;
  timeRange: string;
  description: string;
  environment: Environment;
  requiredEvolution?: string; // この時代を生き抜くために必要な進化
  eventProbability: number;
}

export interface Environment {
  temperature: number; // -50 (極寒) 〜 100 (極熱)
  oxygen: number;      // 0 (嫌気) 〜 100 (富酸素)
  toxicity: number;    // 0 (無毒) 〜 100 (猛毒)
  hazard: number;      // 0 (安全) 〜 100 (超危険)
}

export type EvolutionCategory = 'movement' | 'defense' | 'sensory' | 'metabolism';

export interface EvolutionOption {
  id: string;
  name: string;
  category: EvolutionCategory;
  description: string;
  flavorText: string;
  cost: number;
  unlockedAtEra: EraType;
  stats: {
    maxHp?: number;
    speed?: number;
    sensor?: number;      // エサ探知力 (ピクセル半径)
    heatResist?: number;  // 0 〜 100
    coldResist?: number;  // 0 〜 100
    damageReduce?: number; // 0 〜 1.0 (軽減率)
    spikes?: number;      // 接触カウンターダメージ
    oxygenBenefit?: boolean; // 酸素をプラスにするか
  };
}

export interface ExtinctionEvent {
  name: string;
  japaneseName: string;
  description: string;
  effectText: string;
  duration: number; // 秒数
  tempChange: number;
  oxyChange: number;
  toxChange: number;
  hazChange: number;
  requiredEvolution?: string; // 生き残るための特定の進化
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  score: number;
  speed: number;
  sensor: number;
  heatResist: number;
  coldResist: number;
  damageReduce: number;
  spikes: number;
  oxygenBenefit: boolean;
  evolutions: string[]; // 所有している進化IDのリスト
}

export interface GameSave {
  highScore: number;
  maxEraReached: EraType;
  unlockedEvolutions: string[]; // 図鑑で解放された進化ID
}
