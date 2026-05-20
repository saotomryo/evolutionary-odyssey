import React, { useState } from 'react';
import type { EraType } from '../game/types';
import { EVOLUTIONS, ERAS } from '../game/constants';

interface EvolutionModalProps {
  currentEra: EraType;
  ownedEvolutions: string[];
  onSelectEvolution: (evolutionId: string) => void;
  onGameClear?: () => void; // すべての進化を完了した際の実質クリア用
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({
  currentEra,
  ownedEvolutions,
  onSelectEvolution,
  onGameClear
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const era = ERAS[currentEra];

  // この時代でアンロックされ、プレイヤーがまだ持っていない進化オプションを抽出
  const availableOptions = EVOLUTIONS.filter(
    option => option.unlockedAtEra === currentEra && !ownedEvolutions.includes(option.id)
  );

  // もしこの時代に新しい進化がない場合は、過去の未獲得の進化を提示
  const displayedOptions = availableOptions.length > 0 
    ? availableOptions 
    : EVOLUTIONS.filter(option => !ownedEvolutions.includes(option.id)).slice(0, 3);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onSelectEvolution(selectedId);
    } else if (displayedOptions.length === 0 && onGameClear) {
      onGameClear(); // すべての進化を習得している場合はクリア！
    }
  };

  return (
    <div className="modal-overlay">
      <div className="evo-container">
        <div className="evo-header">
          <h2 className="text-gradient-green-cyan text-glow-green">遺伝子コードの変異を選択</h2>
          <p>{era.japaneseName}の環境に適応するため、新たな特性を獲得しましょう。</p>
        </div>

        <div className="evo-grid">
          {displayedOptions.length > 0 ? (
            displayedOptions.map(option => {
              const isSelected = selectedId === option.id;
              
              // カテゴリごとのグローCSSクラス
              const categoryClass = 
                option.category === 'movement' ? 'cyan-glow movement' :
                option.category === 'defense' ? 'green-glow defense' :
                option.category === 'sensory' ? 'purple-glow sensory' : 'yellow-glow metabolism';

              return (
                <div
                  key={option.id}
                  className={`evo-card glass-panel ${categoryClass} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.id)}
                >
                  <span className="evo-card-category">{
                    option.category === 'movement' ? '運動器官 ➔' :
                    option.category === 'defense' ? '防御外殻 ➔' :
                    option.category === 'sensory' ? '感覚・脳 ➔' : '代謝機構 ➔'
                  }</span>
                  
                  <h3 className="evo-card-title">{option.name}</h3>
                  <p className="evo-card-desc">{option.description}</p>
                  
                  <p className="evo-card-flavor">“ {option.flavorText} ”</p>

                  <div className="evo-card-stats">
                    {option.stats.maxHp && (
                      <div className="evo-stat-row">
                        <span className="evo-stat-label">最大生命力</span>
                        <span className="evo-stat-value">+{option.stats.maxHp} HP</span>
                      </div>
                    )}
                    {option.stats.speed && (
                      <div className="evo-stat-row">
                        <span className="evo-stat-label">遊泳・移動速度</span>
                        <span className="evo-stat-value">+{Math.round(option.stats.speed * 20)}%</span>
                      </div>
                    )}
                    {option.stats.sensor && (
                      <div className="evo-stat-row">
                        <span className="evo-stat-label">エサ感知範囲</span>
                        <span className="evo-stat-value">+{option.stats.sensor}px</span>
                      </div>
                    )}
                    {option.stats.damageReduce && (
                      <div className="evo-stat-row">
                        <span className="evo-stat-label">被ダメージ軽減</span>
                        <span className="evo-stat-value">+{Math.round(option.stats.damageReduce * 100)}%</span>
                      </div>
                    )}
                    {option.stats.heatResist && (
                      <div className="evo-stat-row">
                        <span className="evo-stat-label">耐熱性</span>
                        <span className="evo-stat-value">+{option.stats.heatResist}</span>
                      </div>
                    )}
                    {option.stats.coldResist && (
                      <div className="evo-stat-row">
                        <span className="evo-stat-label">耐寒性</span>
                        <span className="evo-stat-value">+{option.stats.coldResist}</span>
                      </div>
                    )}
                    {option.stats.spikes && (
                      <div className="evo-stat-row">
                        <span className="evo-stat-label">防御反撃トゲ</span>
                        <span className="evo-stat-value">{option.stats.spikes} dmg</span>
                      </div>
                    )}
                    {option.stats.oxygenBenefit && (
                      <div className="evo-stat-row">
                        <span className="evo-stat-label">代謝順応</span>
                        <span className="evo-stat-value">酸素呼吸</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '30px' }}>
              <p>獲得可能な進化はすべて習得しました！そのまま進みましょう。</p>
            </div>
          )}
        </div>

        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={!selectedId && displayedOptions.length > 0}
          style={{ 
            width: displayedOptions.length === 0 ? '320px' : '200px',
            background: displayedOptions.length === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' : '',
            boxShadow: displayedOptions.length === 0 ? '0 0 20px rgba(251, 191, 36, 0.65)' : '',
            fontWeight: 800
          }}
        >
          {displayedOptions.length === 0 ? '👑 究極進化を確定する (ゲームクリア)' : '変異を確定する'}
        </button>
      </div>
    </div>
  );
};
