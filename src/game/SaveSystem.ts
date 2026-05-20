import type { GameSave, EraType } from './types';

const SAVE_KEY = 'evolution_odyssey_save_v1';

const DEFAULT_SAVE: GameSave = {
  highScore: 0,
  maxEraReached: 'HADEAN_ARCHEAN',
  unlockedEvolutions: []
};

export const SaveSystem = {
  // セーブデータの読み込み
  load(): GameSave {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return DEFAULT_SAVE;
      
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SAVE,
        ...parsed,
        unlockedEvolutions: parsed.unlockedEvolutions || []
      };
    } catch (e) {
      console.error('Failed to load game save data from LocalStorage', e);
      return DEFAULT_SAVE;
    }
  },

  // セーブデータの保存
  save(data: GameSave): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save game data to LocalStorage', e);
    }
  },

  // スコア更新
  saveHighScore(score: number): number {
    const current = this.load();
    if (score > current.highScore) {
      current.highScore = score;
      this.save(current);
      return score;
    }
    return current.highScore;
  },

  // 到達した最大時代を保存
  saveMaxEra(era: EraType): void {
    const current = this.load();
    const eraOrder: EraType[] = ['HADEAN_ARCHEAN', 'PROTEROZOIC', 'PALEOZOIC', 'MESOZOIC', 'CENOZOIC'];
    
    const maxIdx = eraOrder.indexOf(current.maxEraReached);
    const newIdx = eraOrder.indexOf(era);

    if (newIdx > maxIdx) {
      current.maxEraReached = era;
      this.save(current);
    }
  },

  // 新しい進化をアンロック（図鑑登録）
  unlockEvolution(evolutionId: string): void {
    const current = this.load();
    if (!current.unlockedEvolutions.includes(evolutionId)) {
      current.unlockedEvolutions.push(evolutionId);
      this.save(current);
    }
  },

  // ファイルへエクスポート (JSONダウンロード)
  exportToFile(): void {
    try {
      const current = this.load();
      const dataStr = JSON.stringify(current, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'evolution_odyssey_save.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      console.error('Failed to export save file', e);
    }
  },

  // ファイルからインポート
  importFromJSON(jsonStr: string): GameSave {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid save format');
      }
      
      const imported: GameSave = {
        highScore: typeof parsed.highScore === 'number' ? parsed.highScore : 0,
        maxEraReached: typeof parsed.maxEraReached === 'string' ? parsed.maxEraReached : 'HADEAN_ARCHEAN',
        unlockedEvolutions: Array.isArray(parsed.unlockedEvolutions) ? parsed.unlockedEvolutions : []
      };
      
      this.save(imported);
      return imported;
    } catch (e) {
      console.error('Failed to import save from JSON string', e);
      throw e;
    }
  }
};
