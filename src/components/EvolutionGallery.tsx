import React, { useState } from 'react';
import { EVOLUTIONS, ERAS } from '../game/constants';
import type { EraType } from '../game/types';

interface EvolutionGalleryProps {
  unlockedIds: string[];
  maxEraReached: EraType;
  onClose: () => void;
}

export const EvolutionGallery: React.FC<EvolutionGalleryProps> = ({
  unlockedIds,
  maxEraReached,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'creatures' | 'mutations'>('creatures');

  const eraOrder: EraType[] = ['HADEAN_ARCHEAN', 'PROTEROZOIC', 'PALEOZOIC', 'MESOZOIC', 'CENOZOIC'];
  const currentMaxIdx = eraOrder.indexOf(maxEraReached);

  // Era creature naming
  const getCreatureName = (eraKey: EraType) => {
    switch (eraKey) {
      case 'HADEAN_ARCHEAN':
        return '始生代の極限環境細胞 (始生細胞)';
      case 'PROTEROZOIC':
        return '原生代の藻類多細胞体 (真核集落)';
      case 'PALEOZOIC':
        return '古生代の遊泳捕食者 (アノマロカリス・ネクトン)';
      case 'MESOZOIC':
        return '中生代の俊敏な夜行動物 (原始キノドン哺乳類)';
      case 'CENOZOIC':
        return '新生代の高度知性生命 (ネオ・サピエンス霊長類)';
      default:
        return '生命体';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="gallery-modal glass-panel cyan-glow" style={{ maxWidth: '850px', maxHeight: '85%' }}>
        <div className="gallery-header" style={{ marginBottom: '16px' }}>
          <div>
            <h2 className="text-gradient-cyan-purple" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              🧬 進化生物図鑑
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              46億年の旅で獲得した生物形態と、解放された遺伝子変異の記録です。
            </p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              🧬 変異収集率: {unlockedIds.length} / {EVOLUTIONS.length} ({Math.round((unlockedIds.length / EVOLUTIONS.length) * 100)}%)
            </span>
            <span style={{ fontSize: '0.82rem', color: '#22d3ee', fontWeight: 700 }}>
              🌍 最高到達年代: {ERAS[maxEraReached]?.japaneseName || '冥王代'}
            </span>
          </div>
        </div>

        {/* タブ選択バー */}
        <div className="gallery-tabs">
          <button
            className={`gallery-tab-btn ${activeTab === 'creatures' ? 'active' : ''}`}
            onClick={() => setActiveTab('creatures')}
          >
            🌍 歴代の獲得生物 (姿)
          </button>
          <button
            className={`gallery-tab-btn ${activeTab === 'mutations' ? 'active' : ''}`}
            onClick={() => setActiveTab('mutations')}
          >
            🧬 解放された遺伝子変異
          </button>
        </div>

        {activeTab === 'creatures' ? (
          /* 1. 歴代生物形態タブ */
          <div className="gallery-creatures-grid">
            {eraOrder.map((eraKey, idx) => {
              const era = ERAS[eraKey];
              const isUnlocked = idx <= currentMaxIdx;

              // 各時代ごとのネオングロークラス
              let glowColorClass = 'green-glow';
              if (eraKey === 'PROTEROZOIC') glowColorClass = 'sky-glow';
              else if (eraKey === 'PALEOZOIC') glowColorClass = 'cyan-glow';
              else if (eraKey === 'MESOZOIC') glowColorClass = 'gold-glow';
              else if (eraKey === 'CENOZOIC') glowColorClass = 'purple-glow';

              return (
                <div key={eraKey} className={`gallery-creature-card ${isUnlocked ? `unlocked ${glowColorClass}` : 'locked'}`}>
                  {isUnlocked ? (
                    <>
                      <div className="gallery-creature-img-container">
                        <img 
                          src={`icons/${eraKey.toLowerCase()}.png`} 
                          alt={era.japaneseName} 
                          className="gallery-creature-img" 
                        />
                      </div>
                      <div className="gallery-creature-info">
                        <span className="gallery-creature-era">{era.japaneseName}</span>
                        <span className="gallery-creature-time">{era.timeRange}</span>
                        <h4 className="gallery-creature-title">{getCreatureName(eraKey)}</h4>
                        <p className="gallery-creature-desc">{era.description}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="gallery-creature-img-container locked">
                        <div className="gallery-lock-overlay">
                          <span className="lock-char">🔒</span>
                        </div>
                      </div>
                      <div className="gallery-creature-info locked">
                        <span className="gallery-creature-era">??? (未到達)</span>
                        <span className="gallery-creature-time">{era.timeRange}</span>
                        <h4 className="gallery-creature-title" style={{ color: 'var(--text-muted)' }}>未知の生命形態</h4>
                        <p className="gallery-creature-desc" style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          生存競争を勝ち抜き、「{era.japaneseName}」に到達することで、この時代の生物画像と詳細な姿が解放されます。
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* 2. 遺伝子変異タブ (標準のグリッド) */
          <div className="gallery-grid">
            {EVOLUTIONS.map(evo => {
              const isUnlocked = unlockedIds.includes(evo.id);
              const era = ERAS[evo.unlockedAtEra];

              if (isUnlocked) {
                return (
                  <div key={evo.id} className="gallery-item unlocked">
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color:
                        evo.category === 'movement' ? 'var(--color-secondary)' :
                        evo.category === 'defense' ? 'var(--color-primary)' :
                        evo.category === 'sensory' ? 'var(--color-accent)' : 'var(--color-warning)'
                    }}>
                      {evo.category === 'movement' ? '運動器官' :
                       evo.category === 'defense' ? '防御外殻' :
                       evo.category === 'sensory' ? '感覚器官' : '代謝機構'} | {era.japaneseName}
                    </span>
                    <h4 className="gallery-item-title">{evo.name}</h4>
                    <p className="gallery-item-desc">{evo.description}</p>
                  </div>
                );
              } else {
                return (
                  <div key={evo.id} className="gallery-item locked">
                    <div className="gallery-lock-icon">🔒</div>
                    <h4 className="gallery-item-title" style={{ color: 'var(--text-muted)' }}>未知の変異遺伝子</h4>
                    <p className="gallery-item-desc" style={{ color: 'var(--text-muted)' }}>
                      解放ヒント：{era.japaneseName}期に進む
                    </p>
                  </div>
                );
              }
            })}
          </div>
        )}

        <button
          className="btn-secondary"
          onClick={onClose}
          style={{ marginTop: '20px', width: '100%', textTransform: 'uppercase', fontWeight: 700 }}
        >
          メニューに戻る
        </button>
      </div>
    </div>
  );
};
