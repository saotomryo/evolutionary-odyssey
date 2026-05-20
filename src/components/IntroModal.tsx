import React, { useState } from 'react';
import { publicAssetPath } from '../game/assets';

interface IntroModalProps {
  onConfirm: () => void;
}

const renderOriginOfLifeSvg = () => {
  return (
    <svg className="landscape-svg origin-landscape" viewBox="0 0 600 260">
      <defs>
        {/* 冥王代・原始地球のダークバイオレット＆インフェルノレッドの地獄グラデーション */}
        <linearGradient id="origin-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e001e" />
          <stop offset="60%" stopColor="#0f000f" />
          <stop offset="100%" stopColor="#2e0804" />
        </linearGradient>
        {/* 雷のまばゆい輝き */}
        <radialGradient id="lightning-glow" cx="30%" cy="10%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#d8b4fe" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e001e" stopOpacity="0" />
        </radialGradient>
        {/* 熱水噴出孔とスープのグロー */}
        <radialGradient id="soup-glow" cx="50%" cy="80%" r="45%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 背景 */}
      <rect width="600" height="260" fill="url(#origin-bg)" />

      {/* 原始スープの光の渦 */}
      <rect width="600" height="260" fill="url(#soup-glow)" opacity="0.8" />

      {/* 遠景の荒々しい原始山脈のシルエット */}
      <path d="M 0,260 L 0,200 L 80,140 L 150,220 L 260,110 L 380,240 L 490,95 L 600,210 L 600,260 Z" fill="#09010a" opacity="0.85" />
      
      {/* 近景の熱水噴出孔のシルエット */}
      <path d="M 180,260 L 210,170 Q 225,165 240,170 L 270,260 Z" fill="#030005" stroke="#a855f7" strokeWidth="1" />
      <path d="M 330,260 L 350,185 Q 360,180 370,185 L 390,260 Z" fill="#030005" stroke="#10b981" strokeWidth="1" />

      {/* 噴き出す超高温の黒煙と熱水（サイバーネオン粒子） */}
      <path d="M 225,168 Q 190,110 240,50 T 200,0" fill="none" stroke="#c084fc" strokeWidth="14" strokeLinecap="round" opacity="0.18" className="landscape-gas gas-1" />
      <path d="M 360,182 Q 390,120 340,60 T 380,0" fill="none" stroke="#34d399" strokeWidth="12" strokeLinecap="round" opacity="0.15" className="landscape-gas gas-2" />

      {/* 海面をのたうち回る原始の巨大なうねり（波） */}
      <path d="M -50,260 Q 100,180 250,230 T 550,190 T 650,210 L 650,260 Z" fill="#120117" opacity="0.9" />
      <path d="M -50,260 Q 150,210 350,250 T 650,220 L 650,260 Z" fill="#0c0010" />

      {/* 激しい雷雨（閃光）のオーバーレイ */}
      <rect width="600" height="260" fill="url(#lightning-glow)" className="lightning-flash-bg" opacity="0" />
      
      {/* ジグザグの雷光ライン */}
      <path d="M 180,0 L 220,60 L 190,110 L 250,150 L 230,195 L 245,210" fill="none" stroke="#f3e8ff" strokeWidth="2.5" className="lightning-bolt" opacity="0" />
      <path d="M 420,0 L 390,40 L 430,90 L 400,130 L 415,160" fill="none" stroke="#e9d5ff" strokeWidth="1.5" className="lightning-bolt-2" opacity="0" />

      {/* 原始のスープに浮かぶ、自己複製能力を持つアミノ酸・RNAの光る胞子（有機物粒子） */}
      <g fill="#a855f7" className="soup-particles">
        <circle cx="280" cy="180" r="4.5" className="soup-p sp-1" />
        <circle cx="340" cy="210" r="3.5" className="soup-p sp-2" />
        <circle cx="210" cy="140" r="5" className="soup-p sp-3" fill="#10b981" />
        <circle cx="160" cy="190" r="3" className="soup-p sp-4" />
        <circle cx="430" cy="220" r="4" className="soup-p sp-5" fill="#10b981" />
        <circle cx="480" cy="170" r="3.5" className="soup-p sp-6" />
        <circle cx="250" cy="230" r="5.5" className="soup-p sp-7" fill="#60a5fa" />
        <circle cx="380" cy="150" r="3" className="soup-p sp-8" fill="#60a5fa" />
      </g>

      {/* 優雅に回転し繋がろうとする生命の起源である最初の「二重らせん」の原始シルエット */}
      <g opacity="0.35" className="rna-helix" transform="translate(100, 70) scale(0.6)">
        <path d="M 0,20 Q 25,-20 50,20 T 100,20" fill="none" stroke="#a855f7" strokeWidth="3" />
        <path d="M 0,-20 Q 25,20 50,-20 T 100,-20" fill="none" stroke="#10b981" strokeWidth="3" />
        <line x1="12" y1="-12" x2="12" y2="12" stroke="#e9d5ff" strokeWidth="1.5" />
        <line x1="37" y1="-8" x2="37" y2="8" stroke="#e9d5ff" strokeWidth="1.5" />
        <line x1="62" y1="-8" x2="62" y2="8" stroke="#e9d5ff" strokeWidth="1.5" />
        <line x1="87" y1="-12" x2="87" y2="12" stroke="#e9d5ff" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

export const IntroModal: React.FC<IntroModalProps> = ({ onConfirm }) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const imagePath = publicAssetPath('images/events/origin_of_life.png');

  return (
    <div className="modal-overlay">
      <div className="event-modal-container glass-panel purple-glow intro-modal-panel">
        <div className="event-modal-header text-glow-purple animate-pulse" style={{ color: 'var(--color-secondary)', textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}>
          🧬 PROLOGUE: 生命の起源 🧬
        </div>

        {/* 精密な外部画像、または生命発生環境の動くSVG風景ビジュアル（フォールバック） */}
        <div className="event-landscape-container" style={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}>
          {imagePath && !imageError ? (
            <img 
              src={imagePath} 
              alt="生命が発生した環境" 
              className="landscape-image"
              onError={() => {
                console.warn(`Failed to load origin of life image: ${imagePath}, falling back to SVG.`);
                setImageError(true);
              }}
            />
          ) : (
            renderOriginOfLifeSvg()
          )}
        </div>

        <h2 className="event-modal-title text-glow-purple" style={{ color: '#e9d5ff', textShadow: '0 0 15px rgba(168, 85, 247, 0.75), 0 0 3px #fff' }}>
          海と大気の黎明
        </h2>

        <p className="event-modal-description" style={{ maxHeight: '180px', overflowY: 'auto' }}>
          46億年前の原始地球。そこは荒れ狂う嵐、稲妻、猛烈な紫外線、そして火山から吹き出す有毒ガスに満ちた死の世界でした。
          <br /><br />
          しかし、太陽の光も届かない海底の「熱水噴出孔（深海スモーカー）」の傍らで、地球の内部熱と高濃度の重金属が奇跡的な触媒となり、最初の有機物化学スープが沸き立ちます。
          <br /><br />
          物質が自律的に組織化し、自己複製を始めるとき、最初の単細胞生命が誕生しました。いま、46億年にも及ぶ果てしない進化の旅路がここから幕を開けます。
        </p>

        <div className="event-modal-footer">
          <button 
            className="btn-primary event-confirm-btn" 
            onClick={onConfirm}
            style={{ 
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.55)',
              fontWeight: 800
            }}
          >
            🧬 46億年の旅へ踏み出す (旅の始まり)
          </button>
        </div>
      </div>
    </div>
  );
};
