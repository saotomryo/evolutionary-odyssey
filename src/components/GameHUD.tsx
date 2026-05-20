import React, { useState } from 'react';
import type { PlayerStats, EraType } from '../game/types';
import { ERAS } from '../game/constants';
import { sound } from '../game/SoundGenerator';

interface GameHUDProps {
  stats: PlayerStats;
  currentEra: EraType;
  eraProgress: number; // 0 〜 100
  onMuteToggle: () => void;
  onPauseToggle: () => void;
  isPaused: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  currentEra,
  eraProgress,
  onMuteToggle,
  onPauseToggle,
  isPaused
}) => {
  const [muted, setMuted] = useState(false);
  const era = ERAS[currentEra];

  const handleMuteClick = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
    onMuteToggle();
  };

  // 時代ごとの年代表記を進行度（eraProgress）に基づいてリアルタイム計算
  const getDynamicTimelineString = (): string => {
    const progress = eraProgress / 100;
    
    switch (currentEra) {
      case 'HADEAN_ARCHEAN': {
        // 46億年前 〜 25億年前
        const years = 4.6 - progress * (4.6 - 2.5);
        return `${years.toFixed(2)} 億年前`;
      }
      case 'PROTEROZOIC': {
        // 25億年前 〜 5.4億年前
        const years = 2.5 - progress * (2.5 - 0.54);
        return `${years.toFixed(2)} 億年前`;
      }
      case 'PALEOZOIC': {
        // 5.4億年前 〜 2.5億年前
        const years = 540 - progress * (540 - 250);
        return `${Math.round(years)} 百万年前`;
      }
      case 'MESOZOIC': {
        // 2.5億年前 〜 6600万年前
        const years = 250 - progress * (250 - 66);
        return `${Math.round(years)} 百万年前`;
      }
      case 'CENOZOIC': {
        // 6600万年前 〜 現在
        const years = 66 - progress * 66;
        if (years < 1) {
          return `${Math.round(years * 10000)} 万年前`;
        }
        return `${Math.round(years)} 百万年前`;
      }
      default:
        return era.timeRange;
    }
  };

  return (
    <div className="hud-container">
      {/* 左パネル: HPと進化エネルギー */}
      <div className="hud-panel hud-left glass-panel cyan-glow">
        {/* HP */}
        <div className="hud-stat-group">
          <div className="hud-label-row hud-label-hp">
            <span>生命力 (HP)</span>
            <span>{Math.round(stats.hp)} / {stats.maxHp}</span>
          </div>
          <div className="hud-bar-container">
            <div 
              className="hud-bar hp" 
              style={{ width: `${Math.max(0, (stats.hp / stats.maxHp) * 100)}%` }}
            />
          </div>
        </div>

        {/* 進化エネルギー */}
        <div className="hud-stat-group">
          <div className="hud-label-row hud-label-energy">
            <span>進化エネルギー</span>
            <span>{Math.round(stats.energy)}%</span>
          </div>
          <div className="hud-bar-container">
            <div 
              className="hud-bar energy" 
              style={{ width: `${stats.energy}%` }}
            />
          </div>
        </div>
      </div>

      {/* 右パネル: 時代と年代、スコア、ポーズ/ミュート */}
      <div className="hud-panel hud-right glass-panel purple-glow">
        <div>
          <h2 className="hud-era-title text-gradient-cyan-purple">{era.japaneseName}</h2>
          <div className="hud-era-subtitle">{era.name} | {getDynamicTimelineString()}</div>
        </div>

        <div style={{ marginTop: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SCORE: </span>
          <span className="hud-score-value">{stats.score.toLocaleString()}</span>
        </div>

        <div className="hud-controls">
          {/* ポーズボタン */}
          <button className="hud-icon-btn" onClick={onPauseToggle} title="一時停止">
            {isPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>

          {/* ミュートボタン */}
          <button className="hud-icon-btn" onClick={handleMuteClick} title={muted ? "音声を有効にする" : "ミュート"}>
            {muted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
