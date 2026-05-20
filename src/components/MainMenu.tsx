import React from 'react';
import { sound } from '../game/SoundGenerator';
import type { GameSave } from '../game/types';
import { SaveSystem } from '../game/SaveSystem';

interface MainMenuProps {
  saveData: GameSave;
  onStartGame: () => void;
  onOpenGallery: () => void;
  onImportSave: (saveData: GameSave) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ saveData, onStartGame, onOpenGallery, onImportSave }) => {
  const handleStart = () => {
    // ユーザーインタラクション時に Web Audio API を初期化
    sound.init();
    sound.resume();
    onStartGame();
  };

  const handleExport = () => {
    SaveSystem.exportToFile();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = SaveSystem.importFromJSON(text);
        onImportSave(imported);
        alert('セーブデータをインポートしました！');
      } catch (err) {
        alert('セーブデータのインポートに失敗しました。正しいJSONファイルかご確認ください。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="menu-overlay">
      <div className="menu-content glass-panel cyan-glow">
        <h1 className="menu-title text-glow-cyan">
          <span className="text-gradient-cyan-purple">Evolutionary</span>
          <br />
          Odyssey
        </h1>
        <p className="menu-subtitle text-glow-green">―― 46億年の生命進化シミュレータ ――</p>

        <div className="menu-intro-card">
          <h3>🧬 生存と適応のルール</h3>
          <p>・<strong>捕食と進化：</strong> 浮遊する青い栄養素や黄金のDNAを摂取して進化エネルギーを蓄えましょう。</p>
          <p>・<strong>危険回避：</strong> マグマや毒ガス、鋭い氷、そして時代の頂点に君臨する巨大な捕食者を回避してください。</p>
          <p>・<strong>時代の試練：</strong> 大酸化イベント、全地球凍結、巨大隕石衝突など、地球史に残る大絶滅イベントを遺伝子進化で生き延びましょう。</p>
          <p>・<strong>PC / スマホ両対応：</strong> PCはマウス移動またはキーボード（WASD/矢印）、スマホは画面ドラッグのジョイスティックで直感的に操作できます。</p>
        </div>

        <div className="menu-actions">
          <button className="btn-primary" onClick={handleStart}>
            旅を始める（音が出ます）
          </button>
          
          <button className="btn-secondary" onClick={onOpenGallery}>
            進化図鑑を見る ({saveData.unlockedEvolutions.length} / 15)
          </button>
        </div>

        <div className="menu-save-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleExport}>
            <span>💾</span> セーブ書き出し (.json)
          </button>
          <label className="btn-secondary" style={{ fontSize: '0.78rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>📁</span> セーブ読み込み
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>

        {saveData.highScore > 0 && (
          <div className="highscore-badge">
            🏆 ハイスコア: {saveData.highScore.toLocaleString()} 点 (到達最大期: {
              saveData.maxEraReached === 'HADEAN_ARCHEAN' ? '冥王代・始生代' :
              saveData.maxEraReached === 'PROTEROZOIC' ? '原生代' :
              saveData.maxEraReached === 'PALEOZOIC' ? '古生代' :
              saveData.maxEraReached === 'MESOZOIC' ? '中生代' : '新生代'
            })
          </div>
        )}
      </div>
    </div>
  );
};
