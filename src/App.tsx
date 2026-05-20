import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import type { GameSave, GameState, EraType, ExtinctionEvent, PlayerStats } from './game/types';
import { SaveSystem } from './game/SaveSystem';
import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { EvolutionModal } from './components/EvolutionModal';
import { GameOverModal } from './components/GameOverModal';
import { EvolutionGallery } from './components/EvolutionGallery';
import { EventModal } from './components/EventModal';
import { IntroModal } from './components/IntroModal';
import { sound } from './game/SoundGenerator';
import { ERAS, EVOLUTIONS } from './game/constants';
import { publicAssetPath } from './game/assets';

import './styles/game.css';

const EventWarningArt: React.FC<{ eventName: string; japaneseName: string }> = ({ eventName, japaneseName }) => {
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    setImageError(false);
  }, [eventName]);

  const getEventImageFilename = (name: string): string => {
    if (name.includes('Oxidation')) return 'great_oxidation.png';
    if (name.includes('Snowball')) return 'snowball_earth.png';
    if (name.includes('Cambrian')) return 'cambrian_explosion.png';
    if (name.includes('Permian')) return 'permian_extinction.png';
    if (name.includes('Meteor')) return 'meteor_impact.png';
    if (name.includes('Ice Age') || name.includes('Glacial')) return 'glacial_cycle.png';
    return '';
  };

  const filename = getEventImageFilename(eventName);
  const imagePath = filename ? publicAssetPath(`images/events/${filename}`) : '';

  if (imagePath && !imageError) {
    return (
      <img 
        src={imagePath} 
        alt={japaneseName} 
        className="warning-event-image"
        onError={() => setImageError(true)}
      />
    );
  }

  if (eventName.includes('Oxidation')) {
    // 大酸化破局: グリーンとシアンのガス、気泡
    return (
      <svg className="event-svg oxidation-art" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="grad-ox" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="url(#grad-ox)" />
        <circle className="ox-bubble bubble-1" cx="60" cy="130" r="12" fill="#06b6d4" opacity="0.6" />
        <circle className="ox-bubble bubble-2" cx="140" cy="90" r="18" fill="#10b981" opacity="0.7" />
        <circle className="ox-bubble bubble-3" cx="90" cy="60" r="8" fill="#34d399" opacity="0.8" />
        <circle className="ox-bubble bubble-4" cx="120" cy="140" r="10" fill="#22d3ee" opacity="0.5" />
        <path d="M 40,100 Q 80,60 120,100 T 160,100" fill="none" stroke="#6ee7b7" strokeWidth="4" strokeLinecap="round" opacity="0.4" className="ox-wave-1"/>
        <path d="M 40,120 Q 80,160 120,120 T 160,120" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.3" className="ox-wave-2"/>
      </svg>
    );
  }
  
  if (eventName.includes('Snowball')) {
    // 全地球凍結: 青い地球と氷結晶、冷気
    return (
      <svg className="event-svg snowball-art" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="grad-snow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill="url(#grad-snow)" stroke="#e0f2fe" strokeWidth="3" className="snow-globe" />
        <line x1="100" y1="50" x2="100" y2="150" stroke="#f0f9ff" strokeWidth="3" opacity="0.7" />
        <line x1="50" y1="100" x2="150" y2="100" stroke="#f0f9ff" strokeWidth="3" opacity="0.7" />
        <line x1="65" y1="65" x2="135" y2="135" stroke="#f0f9ff" strokeWidth="2" opacity="0.6" />
        <line x1="65" y1="135" x2="135" y2="65" stroke="#f0f9ff" strokeWidth="2" opacity="0.6" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5,10" className="snow-ring" />
      </svg>
    );
  }
  
  if (eventName.includes('Cambrian')) {
    // 捕食者大発生: 触手、警告の目
    return (
      <svg className="event-svg cambrian-art" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="grad-pred" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#4c1d95" />
          </radialGradient>
        </defs>
        <path d="M 100,100 C 60,80 30,120 20,70" fill="none" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" className="pred-tentacle tentacle-1" />
        <path d="M 100,100 C 140,80 170,120 180,70" fill="none" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" className="pred-tentacle tentacle-2" />
        <path d="M 100,100 C 70,140 40,160 70,180" fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" className="pred-tentacle tentacle-3" />
        <path d="M 100,100 C 130,140 160,160 130,180" fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" className="pred-tentacle tentacle-4" />
        <circle cx="100" cy="100" r="35" fill="url(#grad-pred)" stroke="#f43f5e" strokeWidth="2" />
        <circle cx="100" cy="100" r="12" fill="#fff" className="pred-eye" />
        <circle cx="100" cy="100" r="6" fill="#000" />
      </svg>
    );
  }
  
  if (eventName.includes('Permian')) {
    // 火山大爆発: 噴き出す溶岩、火の粉
    return (
      <svg className="event-svg permian-art" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="grad-lava" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="60%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <polygon points="100,40 40,170 160,170" fill="#374151" stroke="#f59e0b" strokeWidth="2" />
        <polygon points="100,50 85,170 115,170" fill="url(#grad-lava)" className="lava-flow" />
        <circle className="magma magma-1" cx="100" cy="30" r="10" fill="#f97316" />
        <circle className="magma magma-2" cx="80" cy="20" r="7" fill="#f59e0b" />
        <circle className="magma magma-3" cx="120" cy="25" r="8" fill="#ef4444" />
        <circle className="spark spark-1" cx="60" cy="60" r="3" fill="#fde047" />
        <circle className="spark spark-2" cx="140" cy="50" r="4" fill="#f97316" />
        <circle className="spark spark-3" cx="100" cy="10" r="3" fill="#fde047" />
      </svg>
    );
  }
  
  if (eventName.includes('Meteor')) {
    // 隕石衝突: 突入する火の玉
    return (
      <svg className="event-svg meteor-art" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="grad-meteor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#7f1d1d" opacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M 20,180 A 100,100 0 0,0 180,180" fill="none" stroke="#0284c7" strokeWidth="5" />
        <path d="M 20,180 A 100,100 0 0,0 180,180" fill="#1e1b4b" opacity="0.8" />
        <g className="meteor-group">
          <polygon points="140,20 60,100 80,120 160,40" fill="url(#grad-meteor)" />
          <circle cx="70" cy="110" r="18" fill="#451a03" stroke="#f97316" strokeWidth="3" className="meteor-body" />
          <circle cx="70" cy="110" r="28" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="4,4" className="impact-glow" />
        </g>
      </svg>
    );
  }

  if (eventName.includes('Ice Age') || eventName.includes('Glacial')) {
    // 大氷河期: 氷山と吹雪の渦
    return (
      <svg className="event-svg iceage-art" viewBox="0 0 200 200">
        <polygon points="100,60 50,160 150,160" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
        <polygon points="70,90 30,160 110,160" fill="#94a3b8" stroke="#0ea5e9" strokeWidth="2" opacity="0.6" />
        <polygon points="130,80 90,160 170,160" fill="#e2e8f0" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.9" />
        <path d="M 20,50 Q 60,30 100,50 T 180,50" fill="none" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" className="blizzard-wave wave-1" />
        <path d="M 20,80 Q 60,100 100,80 T 180,80" fill="none" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" className="blizzard-wave wave-2" />
      </svg>
    );
  }
  
  return null;
};

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  // React State 管理
  const [gameState, setGameState] = useState<GameState>('MENU');
  const gameStateRef = useRef<GameState>(gameState);
  gameStateRef.current = gameState; // renderの最新状態を常に即時同期

  const [saveData, setSaveData] = useState<GameSave>(SaveSystem.load());
  const [currentEra, setCurrentEra] = useState<EraType>('HADEAN_ARCHEAN');
  const [eraProgress, setEraProgress] = useState<number>(0);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showAppearance, setShowAppearance] = useState<boolean>(window.innerWidth > 1024);
  
  // イベント通知
  const [activeEvent, setActiveEvent] = useState<ExtinctionEvent | null>(null);
  const [gameOverInfo, setGameOverInfo] = useState<{ score: number; reason: string } | null>(null);
  const [showEventIntro, setShowEventIntro] = useState<boolean>(false);
  const [eventToIntroduce, setEventToIntroduce] = useState<ExtinctionEvent | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(false);

  // タイムスタンプ保持
  const lastTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number>(0);

  // 初回データロード
  useEffect(() => {
    setSaveData(SaveSystem.load());
  }, []);

  // ゲームループ
  const gameLoop = (timestamp: number) => {
    // プレイ中または進化中でない場合はループを即座に終了し、多重ループや余分なCPU消費を完全に防止する
    if (gameStateRef.current !== 'PLAYING' && gameStateRef.current !== 'EVOLVING') {
      return;
    }

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    
    // 経過秒数 (MAX 0.1秒。タブ非アクティブ時のバグを防ぐため上限付き)
    const deltaTime = Math.min(0.1, (timestamp - lastTimeRef.current) / 1000);
    lastTimeRef.current = timestamp;

    const engine = engineRef.current;
    if (engine && !engine.isPaused) {
      engine.update(deltaTime);
      engine.render();

      // UI同期用ステートのポーリング更新（毎フレームではなく時折でも可）
      setPlayerStats({ ...engine.player.stats });
      setEraProgress(engine.eraProgress);
    }

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  // ゲーム開始 (最初からやり直す)
  const handleStartGame = () => {
    engineRef.current = null; // 古いエンジンを確実に破棄して最初から作り直す
    setGameState('PLAYING');
    setShowIntro(true); // 生命発生プロローグを表示
    setIsPaused(true);  // 最初は一時停止
    setActiveEvent(null);
    setGameOverInfo(null);
    lastTimeRef.current = 0;
  };

  // プロローグ確認 (旅立ち)
  const handleConfirmIntro = () => {
    setShowIntro(false);
    const engine = engineRef.current;
    if (engine) {
      engine.isPaused = false;
      setIsPaused(false);
    }
  };

  // その場での復活（コンティニュー - HPのみ全回復させて続行）
  const handleContinueGame = () => {
    const engine = engineRef.current;
    if (engine) {
      // エンジンの復活ロジックを実行 (HP全回復、3.5秒無敵、周囲の敵を安全位置へ退避)
      engine.continueGame();
      
      // UIステート即時同期
      setPlayerStats({ ...engine.player.stats });
      setGameState('PLAYING');
      setIsPaused(false);
      setActiveEvent(null);
      setGameOverInfo(null);
      lastTimeRef.current = 0;

      // サウンドを再起動
      sound.resume();
    }
  };

  // Canvasマウント時の初期化
  useEffect(() => {
    if ((gameState !== 'PLAYING' && gameState !== 'EVOLVING') || !canvasRef.current) {
      // プレイ中および進化中以外はアニメーションループを止める
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      return;
    }

    // 既存のループ予約があれば一旦確実にキャンセルして、多重ループを防止する
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    const canvas = canvasRef.current;
    
    // ウィンドウサイズ適応
    const resizeCanvas = () => {
      if (engineRef.current) {
        engineRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };

    // すでにエンジンが存在する場合は、再生成せずに状態の復元のみ行う
    if (engineRef.current) {
      // 新しくマウントされた Canvas 要素とその 2D コンテキストを再バインドする
      engineRef.current.rebindCanvas(canvas);

      if (gameState === 'EVOLVING') {
        engineRef.current.isPaused = true;
        setIsPaused(true);
      } else if (gameState === 'PLAYING') {
        if (showIntro) {
          engineRef.current.isPaused = true;
          setIsPaused(true);
        } else {
          engineRef.current.isPaused = false;
          setIsPaused(false);
        }
      }
      
      // サイズを新しい Canvas にアジャスト
      resizeCanvas();
    } else {
      // エンジン初期化
      const engine = new GameEngine(
        canvas,
        // 1. 進化モーダルトリガー
        () => {
          setGameState('EVOLVING');
        },
        // 2. ゲームオーバートリガー
        (finalScore, reason) => {
          // スコアと年代をセーブ
          SaveSystem.saveHighScore(finalScore);
          SaveSystem.saveMaxEra(engine.currentEra);

          // 新たに習得したすべての進化を図鑑に登録
          engine.player.stats.evolutions.forEach(evoId => {
            SaveSystem.unlockEvolution(evoId);
          });

          // セーブデータをリロード
          setSaveData(SaveSystem.load());

          setGameOverInfo({ score: finalScore, reason });
          setGameState('GAMEOVER');
        },
        // 3. 時代進行トリガー
        (newEra) => {
          setCurrentEra(newEra);
          SaveSystem.saveMaxEra(newEra);
          setSaveData(SaveSystem.load());
        },
        // 4. イベント開始
        (event) => {
          const engine = engineRef.current;
          if (engine) {
            engine.isPaused = true;
            setIsPaused(true);
            sound.stopAll();
            sound.playExtinctionWarning();
          }
          setEventToIntroduce(event);
          setShowEventIntro(true);
          setActiveEvent(event);
        },
        // 5. イベント終了
        () => {
          setActiveEvent(null);
        }
      );

      engineRef.current = engine;
      setCurrentEra(engine.currentEra);
      setPlayerStats({ ...engine.player.stats });
      
      if (showIntro) {
        engine.isPaused = true;
        setIsPaused(true);
      }
      
      // 初期サイズアジャスト
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }

    // クリーンかつ単一のアニメーションループを確実に再始動する
    lastTimeRef.current = 0; // デルタタイムのジャンプを防ぐために基準時間をリセット
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      // メニュー等に戻った場合のみクリーンアップを実行する
      // GAMEOVERのときはコンティニューのためにエンジンを保持するが、イベントリスナーやアニメーションループは安全に止める
      const nextState = gameStateRef.current;
      if (nextState !== 'PLAYING' && nextState !== 'EVOLVING') {
        window.removeEventListener('resize', resizeCanvas);
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        
        // メニューに戻る時だけ完全にエンジンを破棄
        if (nextState === 'MENU') {
          if (engineRef.current) {
            engineRef.current = null;
          }
        }
      }
    };
  }, [gameState]);

  // 進化完了の確定
  const handleSelectEvolution = (evolutionId: string) => {
    const engine = engineRef.current;
    if (engine) {
      engine.completeEvolution(evolutionId);
      
      // 図鑑にも即座に解放保存
      SaveSystem.unlockEvolution(evolutionId);
      setSaveData(SaveSystem.load());

      setIsPaused(false);
      setGameState('PLAYING');
    }
  };

  // ゲームクリアの確定（全変異のアンロック）
  const handleGameClear = () => {
    const engine = engineRef.current;
    if (engine) {
      engine.isPaused = true;
      setIsPaused(true);
      sound.stopAll();
      sound.playGameClear();

      // 究極進化ボーナス10,000点をスコアに加算
      const finalScore = engine.player.stats.score + 10000;

      // ハイスコアと最大年代、および獲得した全進化をアンロックしてセーブ
      SaveSystem.saveHighScore(finalScore);
      SaveSystem.saveMaxEra(engine.currentEra);
      engine.player.stats.evolutions.forEach(evoId => {
        SaveSystem.unlockEvolution(evoId);
      });
      setSaveData(SaveSystem.load());

      // クリアモーダルの表示情報を設定
      setGameOverInfo({
        score: finalScore,
        reason: '祝！すべての遺伝子変異を網羅し、宇宙で唯一無二の「究極完全生命体」へと進化を遂げました！46億年の進化の旅の完全制覇です！'
      });
      setGameState('GAMEOVER');
    }
  };

  // 大絶滅イベントの風景モーダル確認（OKボタン）
  const handleConfirmEvent = () => {
    setShowEventIntro(false);
    setEventToIntroduce(null);
    
    // 一時停止を解除して大絶滅を開始
    const engine = engineRef.current;
    if (engine) {
      engine.isPaused = false;
      setIsPaused(false);
      sound.resume();
    }
  };

  // 一時停止切り替え
  const handlePauseToggle = () => {
    const engine = engineRef.current;
    if (engine) {
      engine.isPaused = !engine.isPaused;
      setIsPaused(engine.isPaused);
      if (engine.isPaused) {
        sound.stopAll();
      } else {
        sound.resume();
      }
    }
  };

  // --- 入力イベントハンドラ ---

  // マウス移動
  const handleMouseMove = (e: React.MouseEvent) => {
    const engine = engineRef.current;
    if (engine) {
      engine.setInputPosition(e.clientX, e.clientY, true);
    }
  };

  const handleMouseLeave = () => {
    const engine = engineRef.current;
    if (engine) {
      engine.setInputPosition(0, 0, false);
    }
  };

  // スマホのマルチタッチドラッグ操作
  const handleTouchMove = (e: React.TouchEvent) => {
    const engine = engineRef.current;
    if (engine && e.touches.length > 0) {
      const touch = e.touches[0];
      engine.setInputPosition(touch.clientX, touch.clientY, true);
    }
  };

  const handleTouchEnd = () => {
    const engine = engineRef.current;
    if (engine) {
      engine.setInputPosition(0, 0, false);
    }
  };

  // キーボード操作 (WASD/矢印)
  useEffect(() => {
    const activeKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        activeKeys.add(key);
        updateKeyboardVector();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      const key = e.key.toLowerCase();
      activeKeys.delete(key);
      
      if (activeKeys.size === 0) {
        engineRef.current?.releaseKeyboardInput();
      } else {
        updateKeyboardVector();
      }
    };

    const updateKeyboardVector = () => {
      let dx = 0;
      let dy = 0;

      if (activeKeys.has('w') || activeKeys.has('arrowup')) dy -= 1;
      if (activeKeys.has('s') || activeKeys.has('arrowdown')) dy += 1;
      if (activeKeys.has('a') || activeKeys.has('arrowleft')) dx -= 1;
      if (activeKeys.has('d') || activeKeys.has('arrowright')) dx += 1;

      // ベクトルの正規化
      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        engineRef.current?.handleKeyboardInput(dx / len, dy / len);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div className="game-container">
      {/* 1. タイトルメニュー */}
      {gameState === 'MENU' && (
        <MainMenu
          saveData={saveData}
          onStartGame={handleStartGame}
          onOpenGallery={() => setGameState('GALLERY')}
          onImportSave={(importedSave) => setSaveData(importedSave)}
        />
      )}

      {/* 2. 進化図鑑 */}
      {gameState === 'GALLERY' && (
        <EvolutionGallery
          unlockedIds={saveData.unlockedEvolutions}
          maxEraReached={saveData.maxEraReached}
          onClose={() => setGameState('MENU')}
        />
      )}

      {/* 3. ゲームプレイ画面 */}
      {(gameState === 'PLAYING' || gameState === 'EVOLVING') && (
        <>
          <canvas
            ref={canvasRef}
            className="canvas-element"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchMove}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }} // スマホでのスクロール誤動作を完全防止
          />

          {playerStats && (
            <GameHUD
              stats={playerStats}
              currentEra={currentEra}
              eraProgress={eraProgress}
              onMuteToggle={() => {}}
              onPauseToggle={handlePauseToggle}
              isPaused={isPaused}
            />
          )}

          {/* 自分の姿トグルトリガーボタン */}
          {playerStats && (
            <button 
              className={`toggle-appearance-btn glass-panel ${showAppearance ? 'active' : ''}`}
              onClick={() => setShowAppearance(!showAppearance)}
            >
              {showAppearance ? '🧬 姿を閉じる' : '🧬 自分の姿'}
            </button>
          )}

          {/* 自分の姿・生命観察サイドパネル */}
          {playerStats && showAppearance && (
            <div className="appearance-panel glass-panel">
              <div className="appearance-header">
                <h3>自分の姿</h3>
                <span className="era-badge">{ERAS[currentEra]?.japaneseName}</span>
              </div>
              
              <div className="appearance-image-container">
                <img 
                  src={publicAssetPath(`icons/${currentEra.toLowerCase()}.png`)} 
                  alt={ERAS[currentEra]?.japaneseName} 
                  className="appearance-image"
                />
              </div>

              <div className="appearance-stats">
                <div className="stat-row">
                  <span>生命力 (HP)</span>
                  <div className="stat-bar-bg">
                    <div className="stat-bar-fill hp-fill" style={{ width: `${Math.min(100, (playerStats.hp / playerStats.maxHp) * 100)}%` }}></div>
                  </div>
                  <span className="stat-value">{playerStats.hp}/{playerStats.maxHp}</span>
                </div>

                <div className="stat-row">
                  <span>遊泳・移動速度</span>
                  <span className="stat-value text-cyan">{playerStats.speed.toFixed(1)}x</span>
                </div>

                <div className="stat-row">
                  <span>感覚器官 (センサー)</span>
                  <span className="stat-value text-gold">{playerStats.sensor}px</span>
                </div>

                <div className="stat-row">
                  <span>環境耐性 (熱 / 寒)</span>
                  <span className="stat-value text-amber">{playerStats.heatResist}% / {playerStats.coldResist}%</span>
                </div>

                <div className="stat-row">
                  <span>物理防御 (ダメージ軽減)</span>
                  <span className="stat-value text-emerald">{(playerStats.damageReduce * 100).toFixed(0)}%</span>
                </div>

                {playerStats.spikes > 0 && (
                  <div className="stat-row">
                    <span>トゲ反撃力</span>
                    <span className="stat-value text-rose">+{playerStats.spikes}</span>
                  </div>
                )}
              </div>

              <div className="appearance-evolutions">
                <h4>獲得した遺伝子コード</h4>
                {playerStats.evolutions.length === 0 ? (
                  <div className="no-evo">未変異（原始状態）</div>
                ) : (
                  <div className="evo-badges">
                    {playerStats.evolutions.map(evoId => {
                      const evo = EVOLUTIONS.find(e => e.id === evoId);
                      return (
                        <span key={evoId} className={`evo-badge-item ${evo?.category || 'defense'}`}>
                          {evo?.name.split(' (')[0]}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* モバイル用タッチヒント */}
          <div className="touch-hint">
            📱 画面をドラッグ、または WASD / 矢印キーで移動
          </div>
        </>
      )}

      {/* 4. 進化選択画面 */}
      {gameState === 'EVOLVING' && playerStats && (
        <EvolutionModal
          currentEra={currentEra}
          ownedEvolutions={playerStats.evolutions}
          onSelectEvolution={handleSelectEvolution}
          onGameClear={handleGameClear}
        />
      )}

      {/* 5. 大絶滅イベントのリアルタイム警報表示 */}
      {gameState === 'PLAYING' && activeEvent && !showEventIntro && (
        <div className="warning-overlay glass-panel red-glow">
          <div className="warning-title">🚨 大絶滅進行中 🚨</div>
          <div className="warning-art-container">
            <EventWarningArt eventName={activeEvent.name} japaneseName={activeEvent.japaneseName} />
          </div>
          <div className="warning-desc">{activeEvent.japaneseName}</div>
          <div className="warning-effect">{activeEvent.effectText}</div>
        </div>
      )}

      {/* 6. ゲームオーバー・クリア画面 */}
      {gameState === 'GAMEOVER' && gameOverInfo && (
        <GameOverModal
          score={gameOverInfo.score}
          reason={gameOverInfo.reason}
          currentEra={currentEra}
          highScore={saveData.highScore}
          onRestart={handleStartGame}
          onGoToMenu={() => setGameState('MENU')}
          onContinue={handleContinueGame}
        />
      )}

      {/* 7. 大絶滅イベント風景モーダル (一時停止中) */}
      {showEventIntro && eventToIntroduce && playerStats && (
        <EventModal
          event={eventToIntroduce}
          hasRequiredEvolution={
            !eventToIntroduce.requiredEvolution ||
            playerStats.evolutions.includes(eventToIntroduce.requiredEvolution)
          }
          requiredEvolutionName={
            eventToIntroduce.requiredEvolution
              ? EVOLUTIONS.find(e => e.id === eventToIntroduce.requiredEvolution)?.name.split(' (')[0]
              : undefined
          }
          onConfirm={handleConfirmEvent}
        />
      )}

      {/* 8. 生命発生プロローグモーダル (一時停止中) */}
      {showIntro && (
        <IntroModal
          onConfirm={handleConfirmIntro}
        />
      )}
    </div>
  );
};
