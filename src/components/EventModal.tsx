import React, { useState, useEffect } from 'react';
import type { ExtinctionEvent } from '../game/types';
import { publicAssetPath } from '../game/assets';

interface EventModalProps {
  event: ExtinctionEvent;
  hasRequiredEvolution: boolean;
  requiredEvolutionName?: string;
  onConfirm: () => void;
}

const renderLandscapeSvg = (eventName: string) => {
  if (eventName.includes('Oxidation')) {
    // 1. 大酸化破局: 深海から立ち昇る猛烈な酸素の気泡とシアノバクテリアのネオングリーン
    return (
      <svg className="landscape-svg oxidation-landscape" viewBox="0 0 600 260">
        <defs>
          <linearGradient id="ox-bg" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#022c22" />
            <stop offset="50%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="sunray-light" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* 背景グラデーション */}
        <rect width="600" height="260" fill="url(#ox-bg)" />
        <rect width="600" height="260" fill="url(#sunray-light)" />

        {/* 差し込む光線 (サンレイ) */}
        <polygon points="150,0 200,0 350,260 220,260" fill="#22d3ee" opacity="0.12" className="landscape-ray ray-1" />
        <polygon points="350,0 420,0 550,260 430,260" fill="#10b981" opacity="0.1" className="landscape-ray ray-2" />
        <polygon points="50,0 90,0 180,260 110,260" fill="#06b6d4" opacity="0.08" className="landscape-ray ray-3" />

        {/* 海底の岩林・熱水噴出孔のシルエット */}
        <path d="M 0,260 L 0,210 Q 50,180 90,210 T 180,220 Q 230,240 280,200 T 380,230 Q 430,210 490,240 T 600,200 L 600,260 Z" fill="#02140f" />
        
        {/* 熱水噴出孔 (スモーカー) */}
        <path d="M 80,215 L 90,160 L 105,160 L 115,215 Z" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
        <path d="M 420,230 L 430,175 L 442,175 L 452,230 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />

        {/* 噴き出すネオンガス柱 */}
        <path d="M 97,160 Q 75,100 110,50 T 80,0" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round" opacity="0.15" className="landscape-gas gas-1" />
        <path d="M 436,175 Q 460,110 420,60 T 450,0" fill="none" stroke="#22d3ee" strokeWidth="14" strokeLinecap="round" opacity="0.18" className="landscape-gas gas-2" />

        {/* ポコポコと時間差で上昇・拡大する無数の酸素気泡 */}
        <circle cx="120" cy="200" r="16" fill="#06b6d4" opacity="0.5" className="land-bubble lb-1" />
        <circle cx="160" cy="240" r="8" fill="#34d399" opacity="0.6" className="land-bubble lb-2" />
        <circle cx="280" cy="180" r="22" fill="#10b981" opacity="0.4" className="land-bubble lb-3" />
        <circle cx="340" cy="220" r="12" fill="#22d3ee" opacity="0.5" className="land-bubble lb-4" />
        <circle cx="480" cy="190" r="18" fill="#34d399" opacity="0.6" className="land-bubble lb-5" />
        <circle cx="210" cy="230" r="10" fill="#06b6d4" opacity="0.4" className="land-bubble lb-6" />
        <circle cx="520" cy="250" r="14" fill="#10b981" opacity="0.5" className="land-bubble lb-7" />

        {/* 浮遊するシアノバクテリアのクラスタ */}
        <g opacity="0.25" className="bacter-cluster">
          <circle cx="250" cy="100" r="5" fill="#34d399" />
          <circle cx="256" cy="96" r="4" fill="#34d399" />
          <circle cx="262" cy="102" r="5" fill="#10b981" />
          <circle cx="248" cy="106" r="4" fill="#10b981" />
          <path d="M 250,100 C 255,90 265,110 270,100" fill="none" stroke="#34d399" strokeWidth="1" />
        </g>
      </svg>
    );
  }

  if (eventName.includes('Snowball')) {
    // 2. 全地球凍結: 圧倒的な極寒の濃紺、氷山、激しく流れる吹雪
    return (
      <svg className="landscape-svg snowball-landscape" viewBox="0 0 600 260">
        <defs>
          <linearGradient id="snow-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#081b29" />
            <stop offset="60%" stopColor="#0b3c5d" />
            <stop offset="100%" stopColor="#328cc1" />
          </linearGradient>
          <linearGradient id="glacier-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="glacier-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* 背景グラデーション */}
        <rect width="600" height="260" fill="url(#snow-bg)" />

        {/* 遠景の氷山 */}
        <polygon points="50,260 180,100 280,260" fill="url(#glacier-grad-1)" stroke="#38bdf8" strokeWidth="1" />
        <polygon points="220,260 360,70 480,260" fill="url(#glacier-grad-1)" stroke="#0ea5e9" strokeWidth="1" />

        {/* 近景の切り立つ巨大氷河 */}
        <polygon points="-50,260 80,60 210,260" fill="url(#glacier-grad-2)" stroke="#e2e8f0" strokeWidth="1.5" />
        <polygon points="400,260 520,90 650,260" fill="url(#glacier-grad-2)" stroke="#e2e8f0" strokeWidth="1.5" />

        {/* 氷晶の逆回転リング (冷気の渦) */}
        <circle cx="300" cy="130" r="95" fill="none" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3,18" className="snow-ring-slow" opacity="0.3" />
        <circle cx="300" cy="130" r="110" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="6,30" className="snow-ring-fast" opacity="0.2" />

        {/* 左右に流れる吹雪の波動ライン */}
        <path d="M -50,110 Q 100,60 250,110 T 550,110 T 650,90" fill="none" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" className="land-blizzard lb-wave-1" opacity="0.6" />
        <path d="M -50,150 Q 150,180 350,130 T 650,160" fill="none" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" className="land-blizzard lb-wave-2" opacity="0.5" />
        <path d="M -50,70 Q 120,100 300,60 T 650,80" fill="none" stroke="#f0f9ff" strokeWidth="2" strokeLinecap="round" className="land-blizzard lb-wave-3" opacity="0.4" />

        {/* 舞い落ちる雪の結晶粒子 */}
        <g fill="#f8fafc" opacity="0.75" className="snow-particles">
          <circle cx="80" cy="80" r="2" />
          <circle cx="150" cy="160" r="3.5" />
          <circle cx="280" cy="70" r="1.5" />
          <circle cx="350" cy="210" r="3.5" />
          <circle cx="430" cy="120" r="2" />
          <circle cx="510" cy="180" r="2.5" />
        </g>
      </svg>
    );
  }

  if (eventName.includes('Cambrian')) {
    // 3. 生存競争爆発: 太陽光が差し込む海底、触手、アノマロカリスのシルエット
    return (
      <svg className="landscape-svg cambrian-landscape" viewBox="0 0 600 260">
        <defs>
          <linearGradient id="cam-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#083344" />
            <stop offset="60%" stopColor="#164e63" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <radialGradient id="sun-beam" cx="50%" cy="0%" r="90%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#083344" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* 背景 */}
        <rect width="600" height="260" fill="url(#cam-bg)" />
        <rect width="600" height="260" fill="url(#sun-beam)" />

        {/* 海底の美しい海藻・サンゴ岩のシルエット */}
        <path d="M 0,260 L 0,220 C 50,180 80,240 130,230 C 180,220 200,160 250,190 C 300,220 340,240 400,210 C 460,180 500,230 550,220 C 600,210 600,260 600,260 Z" fill="#0c2533" />

        {/* 蠢くネオンピンクの触手群 */}
        <path d="M 80,235 C 60,180 30,190 20,130" fill="none" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" className="land-tentacle sway-left-slow" opacity="0.7" />
        <path d="M 120,230 C 140,160 110,130 150,90" fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" className="land-tentacle sway-right-fast" opacity="0.6" />
        <path d="M 480,225 C 510,150 490,140 520,100" fill="none" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" className="land-tentacle sway-left-fast" opacity="0.65" />
        <path d="M 540,220 C 520,170 560,140 550,80" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" className="land-tentacle sway-right-slow" opacity="0.8" />

        {/* 巨大なアノマロカリスの不気味なシルエット (背景を横切る) */}
        <g className="anomalo-silhouette" opacity="0.8">
          {/* 本体 */}
          <path d="M 280,80 C 230,70 190,90 150,105 L 155,115 C 190,105 230,85 280,95 Z" fill="#030712" />
          <path d="M 280,95 C 330,105 380,80 430,90 L 450,85 L 430,98 C 380,88 330,112 280,95 Z" fill="#030712" />
          {/* 目 */}
          <circle cx="152" cy="98" r="4.5" fill="#f43f5e" className="neon-eye-glow" />
          {/* 触手 */}
          <path d="M 150,105 Q 120,120 135,145" fill="none" stroke="#030712" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 152,107 Q 118,105 125,125" fill="none" stroke="#030712" strokeWidth="3.5" strokeLinecap="round" />
          {/* 扇状のヒレ */}
          <polygon points="200,90 190,65 210,91" fill="#030712" />
          <polygon points="230,92 220,62 240,93" fill="#030712" />
          <polygon points="260,94 250,60 270,95" fill="#030712" />
          <polygon points="290,95 280,62 300,95" fill="#030712" />
          <polygon points="320,95 310,65 330,94" fill="#030712" />
          {/* 尾扇 */}
          <polygon points="430,92 460,75 450,100 465,115" fill="#030712" />
        </g>

        {/* 逃げ惑う小さな原始生命体のシルエット */}
        <path d="M 330,180 Q 300,165 260,180" fill="none" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" className="swim-fish-1" />
        <path d="M 380,150 Q 360,135 320,140" fill="none" stroke="#bae6fd" strokeWidth="2.0" strokeLinecap="round" opacity="0.5" className="swim-fish-2" />
      </svg>
    );
  }

  if (eventName.includes('Permian')) {
    // 4. ペルム紀大量絶滅: 火山爆発、ドロドロ流れる溶岩、空を覆う有毒硫黄ガス雲
    return (
      <svg className="landscape-svg permian-landscape" viewBox="0 0 600 260">
        <defs>
          <linearGradient id="volcano-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#450a0a" />
            <stop offset="60%" stopColor="#1a0505" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="lava-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="30%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <radialGradient id="crater-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* 背景 */}
        <rect width="600" height="260" fill="url(#volcano-bg)" />

        {/* 空に浮かぶ不気味な黄色の有毒ガス雲 */}
        <ellipse cx="120" cy="50" rx="90" ry="25" fill="#facc15" opacity="0.08" className="toxic-cloud cloud-slow" />
        <ellipse cx="450" cy="65" rx="130" ry="35" fill="#eab308" opacity="0.06" className="toxic-cloud cloud-fast" />

        {/* 遠景の荒廃した火山脈のシルエット */}
        <polygon points="80,260 200,120 320,260" fill="#1e1b4b" stroke="#7f1d1d" strokeWidth="0.5" />
        <polygon points="280,260 420,90 560,260" fill="#0f172a" stroke="#ef4444" strokeWidth="0.5" />

        {/* 中央の超巨大火山 (シベリアントラップ) */}
        <polygon points="120,260 300,50 480,260" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
        
        {/* 火口の強烈な輝き */}
        <circle cx="300" cy="53" r="22" fill="url(#crater-glow)" className="crater-pulse" />
        <polygon points="290,53 300,42 310,53" fill="#fde047" />

        {/* 山肌をドロドロと流れ落ちる脈動する溶岩流 */}
        <polygon points="300,53 285,140 302,260 325,260 310,140" fill="url(#lava-grad)" className="lava-pulse" />
        <path d="M 300,53 L 260,180 L 275,260" fill="none" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" className="lava-branch-1" />
        <path d="M 305,65 L 340,160 L 325,260" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" opacity="0.85" className="lava-branch-2" />

        {/* 火口から噴き出すマグマ球体パーティクル */}
        <circle cx="300" cy="35" r="9" fill="#fde047" className="magma-spark ms-1" />
        <circle cx="280" cy="25" r="7" fill="#f97316" className="magma-spark ms-2" />
        <circle cx="320" cy="20" r="8" fill="#ef4444" className="magma-spark ms-3" />
        <circle cx="260" cy="40" r="5.5" fill="#fde047" className="magma-spark ms-4" />
        <circle cx="340" cy="30" r="6" fill="#f97316" className="magma-spark ms-5" />

        {/* 舞い散る無数の火の粉 */}
        <g fill="#fde047" opacity="0.8" className="sparkles">
          <circle cx="80" cy="180" r="2" />
          <circle cx="160" cy="120" r="1.5" />
          <circle cx="220" cy="80" r="2" />
          <circle cx="380" cy="85" r="2.5" />
          <circle cx="440" cy="130" r="1.5" />
          <circle cx="520" cy="190" r="2" />
        </g>
      </svg>
    );
  }

  if (eventName.includes('Meteor')) {
    // 5. 隕石衝突: 燃え盛る赤黒い空、突入する超巨大火球、広がるパルス衝撃波
    return (
      <svg className="landscape-svg meteor-landscape" viewBox="0 0 600 260">
        <defs>
          <linearGradient id="meteor-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4c0519" />
            <stop offset="40%" stopColor="#1e000a" />
            <stop offset="100%" stopColor="#090005" />
          </linearGradient>
          <linearGradient id="fire-trail" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#881337" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="meteor-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="30%" stopColor="#fde047" />
            <stop offset="70%" stopColor="#ea580c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* 背景 */}
        <rect width="600" height="260" fill="url(#meteor-sky)" />

        {/* 衝突地点の海・半島のシルエット */}
        <path d="M 0,260 L 0,210 Q 150,170 300,220 T 600,190 L 600,260 Z" fill="#020005" />
        <path d="M 0,210 Q 150,170 300,220 T 600,190" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.3" />

        {/* 地上の原始密林シルエット */}
        <path d="M -20,220 Q 30,160 80,215 T 180,210 T 280,225 T 390,205 T 490,215 T 620,185 L 620,260 L -20,260 Z" fill="#050005" opacity="0.9" />

        {/* 衝撃のパルスリング (衝撃波) */}
        <ellipse cx="480" cy="180" rx="40" ry="12" fill="none" stroke="#fdba74" strokeWidth="2" className="impact-pulse ip-1" opacity="0" />
        <ellipse cx="480" cy="180" rx="90" ry="26" fill="none" stroke="#ef4444" strokeWidth="3" className="impact-pulse ip-2" opacity="0" />
        <ellipse cx="480" cy="180" rx="160" ry="46" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" className="impact-pulse ip-3" opacity="0" />

        {/* 斜めに急降下する巨大隕石グループ */}
        <g className="meteor-landscape-group">
          {/* 長い炎の尾 */}
          <polygon points="210,-50 490,170 450,190 160,-30" fill="url(#fire-trail)" />
          
          {/* 隕石本体の輝き */}
          <circle cx="470" cy="180" r="45" fill="url(#meteor-glow)" className="meteor-pulse-glow" />
          
          {/* ゴツゴツした岩石核 */}
          <path d="M 456,170 Q 465,160 480,165 Q 492,174 485,188 Q 472,198 460,190 Q 450,182 456,170 Z" fill="#291305" stroke="#f97316" strokeWidth="2" />
        </g>

        {/* 強烈な白光のフラッシュ・光芒 */}
        <line x1="470" y1="180" x2="0" y2="260" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
        <line x1="470" y1="180" x2="600" y2="0" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
        <line x1="470" y1="180" x2="200" y2="0" stroke="#fde047" strokeWidth="0.5" opacity="0.25" />
      </svg>
    );
  }

  if (eventName.includes('Ice Age') || eventName.includes('Glacial')) {
    // 6. 大氷河期: 幾重にもそびえる氷河、激しい吹雪の波形、四隅の霜ネオンフレーム
    return (
      <svg className="landscape-svg glacial-landscape" viewBox="0 0 600 260">
        <defs>
          <linearGradient id="glacial-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="glacier-solid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        
        {/* 背景 */}
        <rect width="600" height="260" fill="url(#glacial-sky)" />

        {/* 遠景の氷山 */}
        <polygon points="80,260 220,130 360,260" fill="#334155" stroke="#64748b" strokeWidth="0.5" />
        <polygon points="260,260 400,110 540,260" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />

        {/* 近景の鋭利な巨大氷河 */}
        <polygon points="-40,260 100,80 240,260" fill="url(#glacier-solid)" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="380,260 500,95 620,260" fill="url(#glacier-solid)" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* 流れる吹雪の気流 */}
        <path d="M -50,80 C 100,120 200,40 350,100 T 650,80" fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" className="land-ice-blizzard lib-wave-1" opacity="0.65" />
        <path d="M -50,140 C 150,80 250,160 400,110 T 650,130" fill="none" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" className="land-ice-blizzard lib-wave-2" opacity="0.5" />

        {/* 氷晶のフレーム (四隅に張り付く霜の結晶の枠) */}
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.6" className="frost-frame">
          {/* 左上 */}
          <path d="M 0,40 L 0,0 L 40,0" />
          <line x1="0" y1="0" x2="25" y2="25" />
          <line x1="15" y1="0" x2="0" y2="15" />
          {/* 右上 */}
          <path d="M 560,0 L 600,0 L 600,40" />
          <line x1="600" y1="0" x2="575" y2="25" />
          <line x1="585" y1="0" x2="600" y2="15" />
          {/* 左下 */}
          <path d="M 0,220 L 0,260 L 40,260" />
          <line x1="0" y1="260" x2="25" y2="235" />
          <line x1="15" y1="260" x2="0" y2="245" />
          {/* 右下 */}
          <path d="M 560,260 L 600,260 L 600,220" />
          <line x1="600" y1="260" x2="575" y2="235" />
          <line x1="585" y1="260" x2="600" y2="245" />
        </g>

        {/* マンモスの遥かなシルエット */}
        <g opacity="0.25" className="mammoth-silhouette">
          <path d="M 270,220 Q 260,205 275,200 Q 290,195 300,205 Q 305,210 300,220 Z" fill="#000" />
          {/* 牙 */}
          <path d="M 268,212 Q 260,215 264,222" fill="none" stroke="#fff" strokeWidth="1.2" />
        </g>
      </svg>
    );
  }

  return null;
};

export const EventModal: React.FC<EventModalProps> = ({
  event,
  hasRequiredEvolution,
  requiredEvolutionName,
  onConfirm
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  // イベント切り替え時にエラー状態をリセット
  useEffect(() => {
    setImageError(false);
  }, [event]);

  // イベント名から対応する画像名を取得する
  const getEventImageFilename = (eventName: string): string => {
    if (eventName.includes('Oxidation')) return 'great_oxidation.png';
    if (eventName.includes('Snowball')) return 'snowball_earth.png';
    if (eventName.includes('Cambrian')) return 'cambrian_explosion.png';
    if (eventName.includes('Permian')) return 'permian_extinction.png';
    if (eventName.includes('Meteor')) return 'meteor_impact.png';
    if (eventName.includes('Ice Age') || eventName.includes('Glacial')) return 'glacial_cycle.png';
    return '';
  };

  const filename = getEventImageFilename(event.name);
  const imagePath = filename ? publicAssetPath(`images/events/${filename}`) : '';

  return (
    <div className="modal-overlay">
      <div className="event-modal-container glass-panel red-glow">
        <div className="event-modal-header animate-pulse">
          🚨 絶滅の試練発生 🚨
        </div>

        {/* 精密な外部画像、または動く大迫力SVG風景ビジュアル（フォールバック） */}
        <div className="event-landscape-container">
          {imagePath && !imageError ? (
            <img 
              src={imagePath} 
              alt={event.japaneseName} 
              className="landscape-image"
              onError={() => {
                console.warn(`Failed to load event image: ${imagePath}, falling back to SVG.`);
                setImageError(true);
              }}
            />
          ) : (
            renderLandscapeSvg(event.name)
          )}
        </div>

        <h2 className="event-modal-title text-glow-red">
          {event.japaneseName}
        </h2>

        <p className="event-modal-description">
          {event.description}
        </p>

        {/* 生存適応判定バッジ・セクション */}
        <div className="event-survival-box">
          <div className="survival-label">生存に必要な適応（遺伝子変異）:</div>
          
          {requiredEvolutionName ? (
            <div className="survival-status-wrapper">
              <span className="survival-req-name">🧬 {requiredEvolutionName}</span>
              
              {hasRequiredEvolution ? (
                <div className="survival-badge adapted-badge glass-panel text-glow-green">
                  ✅ 適応完了 (環境耐性あり)
                </div>
              ) : (
                <div className="survival-badge danger-badge glass-panel text-glow-red animate-pulse">
                  ❌ 未適応 (激しいスリップダメージ！)
                </div>
              )}
            </div>
          ) : (
            <div className="survival-badge adapted-badge glass-panel text-glow-green">
              ✅ 全生命体が適応可能 (極限の試練)
            </div>
          )}
        </div>

        <div className="event-modal-footer">
          <button 
            className="btn-primary event-confirm-btn" 
            onClick={onConfirm}
          >
            🔥 生存競争に挑む！ (試練開始)
          </button>
        </div>
      </div>
    </div>
  );
};
