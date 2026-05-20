import React, { useState, useEffect } from 'react';
import type { EraType } from '../game/types';
import { ERAS } from '../game/constants';
import { publicAssetPath } from '../game/assets';

interface GameOverModalProps {
  score: number;
  reason: string;
  currentEra: EraType;
  highScore: number;
  onRestart: () => void;
  onGoToMenu: () => void;
  onContinue?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  reason,
  currentEra,
  highScore,
  onRestart,
  onGoToMenu,
  onContinue
}) => {
  const era = ERAS[currentEra];
  const isGameClear = reason.includes('祝！');
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    setImageError(false);
  }, [reason]);

  const clearImagePath = publicAssetPath('images/events/neo_sapiens.png');
  const fallbackImagePath = publicAssetPath('icons/clear_modern.png');

  return (
    <div className="modal-overlay">
      <div className={`gameover-container glass-panel ${isGameClear ? 'gold-glow gameclear-panel' : 'purple-glow'}`}>
        <h2 className={`gameover-title ${isGameClear ? 'text-gradient-gold-cyan text-glow-gold animate-pulse' : 'text-glow-purple'}`}>
          {isGameClear ? '👑 GAME CLEAR 👑' : '種 の 絶 滅'}
        </h2>
        
        {isGameClear && (
          <div className="clear-image-wrapper">
            <div className="clear-image-container gold-glow">
              <img 
                src={imageError ? fallbackImagePath : clearImagePath} 
                alt="究極生命体 ネオ・サピエンス" 
                className="clear-image"
                onError={() => {
                  console.warn(`Failed to load clear image: ${clearImagePath}, falling back to clear_modern.png.`);
                  setImageError(true);
                }}
              />
            </div>
            <div className="clear-badge">🧬 究極生命体：ネオ・サピエンスへの到達 🧬</div>
          </div>
        )}

        <p className="gameover-reason">
          {reason}
        </p>

        <div className="gameover-stat-box">
          <div className="gameover-stat-item">
            <span className="gameover-stat-label">獲得スコア</span>
            <span className="gameover-stat-value">{score.toLocaleString()} 点</span>
          </div>

          <div className="gameover-stat-item">
            <span className="gameover-stat-label">到達最大年代</span>
            <span className="gameover-stat-value" style={{ color: 'var(--color-secondary)' }}>
              {era.japaneseName}
            </span>
          </div>
        </div>

        {score >= highScore && score > 0 && !isGameClear && (
          <div className="highscore-badge" style={{ marginBottom: '24px', display: 'block' }}>
            🎉 自己ベストスコア更新！
          </div>
        )}

        {!isGameClear && onContinue && (
          <button 
            className="btn-primary" 
            onClick={onContinue} 
            style={{ 
              width: '100%', 
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.45)',
              fontWeight: 800
            }}
          >
            🧬 その場で復活する (HP全回復)
          </button>
        )}

        <button 
          className={isGameClear ? 'btn-primary' : 'btn-secondary'} 
          onClick={onRestart} 
          style={{ width: '100%', marginBottom: '12px' }}
        >
          {isGameClear ? 'もう一度最初から旅に出る' : '最初からやり直す (新しい生命へ)'}
        </button>

        <button className="btn-secondary" onClick={onGoToMenu} style={{ width: '100%' }}>
          メインメニューに戻る
        </button>
      </div>
    </div>
  );
};
