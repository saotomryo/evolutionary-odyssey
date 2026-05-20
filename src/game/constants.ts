import type { Era, EvolutionOption, ExtinctionEvent } from './types';

export const ERAS: Record<string, Era> = {
  HADEAN_ARCHEAN: {
    type: 'HADEAN_ARCHEAN',
    name: 'Hadean / Archean',
    japaneseName: '冥王代・始生代',
    timeRange: '46億年前 〜 25億年前',
    description: '地球の黎明期。猛烈な熱、有毒な火山ガス、荒れ狂う嵐。紫外線が降り注ぐ中、最初の生命（単細胞生物）が熱水噴出孔で誕生します。',
    environment: {
      temperature: 80, // 非常に高温
      oxygen: 2,       // 酸素はほぼゼロ
      toxicity: 60,    // 高い毒性
      hazard: 30       // 中程度の危険度
    },
    eventProbability: 0.05
  },
  PROTEROZOIC: {
    type: 'PROTEROZOIC',
    name: 'Proterozoic',
    japaneseName: '原生代',
    timeRange: '25億年前 〜 5.4億年前',
    description: 'シアノバクテリアが大繁殖し、大気中に酸素を排出し始めます。地球全体が凍りつく「スノーボールアース」などの過酷な試練が訪れます。',
    environment: {
      temperature: 15,  // 比較的安定
      oxygen: 20,       // 酸素濃度上昇
      toxicity: 10,     // 毒性は低下
      hazard: 20        // 安全な環境
    },
    eventProbability: 0.07
  },
  PALEOZOIC: {
    type: 'PALEOZOIC',
    name: 'Paleozoic',
    japaneseName: '古生代',
    timeRange: '5.4億年前 〜 2.5億年前',
    description: 'カンブリア爆発により多様な多細胞生物が爆発的に誕生。生命は海の中で激しく争い、やがて呼吸器と四肢を発達させて乾燥した陸上へと進出します。',
    environment: {
      temperature: 25,  // 温暖
      oxygen: 35,       // 酸素が豊富
      toxicity: 0,      // 毒性ゼロ
      hazard: 50        // 捕食者の増加により危険度高
    },
    eventProbability: 0.08
  },
  MESOZOIC: {
    type: 'MESOZOIC',
    name: 'Mesozoic',
    japaneseName: '中生代',
    timeRange: '2.5億年前 〜 6600万年前',
    description: '恐竜の黄金時代。温暖で湿潤な気候の中、巨大なトカゲたちが地表を支配します。初期の哺乳類はその足元で、知恵と俊敏性を活かして生き延びます。',
    environment: {
      temperature: 40,  // 温暖湿潤
      oxygen: 25,       // 安定した酸素
      toxicity: 0,      // 毒性ゼロ
      hazard: 70        // 巨大生物による極めて高い危険度
    },
    eventProbability: 0.09
  },
  CENOZOIC: {
    type: 'CENOZOIC',
    name: 'Cenozoic',
    japaneseName: '新生代',
    timeRange: '6600万年前 〜 現在',
    description: '隕石衝突の爪痕から再生した地球。哺乳類が多様化し、氷河期の激しい気候変動を乗り越えます。そしてついに、最大の進化「知性」を持つホモ・サピエンスが登場します。',
    environment: {
      temperature: 10,  // 低温化傾向
      oxygen: 21,       // 現在の濃度
      toxicity: 0,      // 毒性ゼロ
      hazard: 60        // 激しい気候と高度な生存競争
    },
    eventProbability: 0.1
  }
};

export const EVOLUTIONS: EvolutionOption[] = [
  // --- 冥王代・始生代の進化 ---
  {
    id: 'chemotaxis',
    name: '化学受容性 (Chemotaxis)',
    category: 'sensory',
    description: '化学物質を感知し、栄養源の方向を察知する能力。エサの方向を矢印でガイドします。',
    flavorText: '混沌の海で、わずかな栄養の匂いを嗅ぎ分ける。これこそが全ての感覚の始祖である。',
    cost: 50,
    unlockedAtEra: 'HADEAN_ARCHEAN',
    stats: { sensor: 250 }
  },
  {
    id: 'heat_membrane',
    name: '耐熱脂質二重膜 (Heat-Resistant Membrane)',
    category: 'defense',
    description: '熱に極めて強い特殊な細胞膜。マグマや火山性熱水の熱によるダメージを80%軽減します。',
    flavorText: '沸騰する熱水噴出孔の傍らで、静かに生命の火を灯し続ける強靭な防壁。',
    cost: 60,
    unlockedAtEra: 'HADEAN_ARCHEAN',
    stats: { heatResist: 85, maxHp: 20 }
  },
  {
    id: 'flagellum',
    name: '原始べん毛 (Primitive Flagellum)',
    category: 'movement',
    description: '細胞尾部をスクリューのように回転させ、遊泳速度を大幅に向上させます。',
    flavorText: '自発的な移動。それは流されるだけの受動的な存在から、「自由意思」を持つ生命への第一歩。',
    cost: 40,
    unlockedAtEra: 'HADEAN_ARCHEAN',
    stats: { speed: 1.5 }
  },

  // --- 原生代の進化 ---
  {
    id: 'oxygen_respiration',
    name: '酸素呼吸システム (Oxygen Respiration)',
    category: 'metabolism',
    description: '劇毒であった酸素を有機代謝に利用し、エネルギーに変換する画期的進化。酸素が多い場所でHPが微回復します。',
    flavorText: '世界を滅ぼしかけた大酸化イベント。死の毒を生命のガソリンへと反転させる奇跡の代謝。',
    cost: 70,
    unlockedAtEra: 'PROTEROZOIC',
    stats: { oxygenBenefit: true, maxHp: 30 }
  },
  {
    id: 'glycolipid_shell',
    name: '耐寒糖脂質シェル (Anti-Freeze Shell)',
    category: 'defense',
    description: '細胞の凍結を防ぐ不凍液を含んだ外殻。極寒（氷河期）によるダメージを80%軽減します。',
    flavorText: '赤道すら凍りついたスノーボールアース。永久凍土の下で、眠るようにぬくもりを守る。',
    cost: 80,
    unlockedAtEra: 'PROTEROZOIC',
    stats: { coldResist: 85, damageReduce: 0.1 }
  },
  {
    id: 'mitochondria_symbiosis',
    name: 'ミトコンドリア共生 (Mitochondrial Symbiosis)',
    category: 'metabolism',
    description: '好気性細菌を細胞内に取り込み、圧倒的なエネルギー効率を獲得。最大HP+50、エネルギー最大容量を上昇。',
    flavorText: '異なる生命の融合。他者を受け入れ一つになることで、限界を超えた出力を獲得する。',
    cost: 90,
    unlockedAtEra: 'PROTEROZOIC',
    stats: { maxHp: 50 }
  },

  // --- 古生代の進化 ---
  {
    id: 'chitin_armor',
    name: 'キチン質外骨格 (Chitinous Armor)',
    category: 'defense',
    description: '硬い殻で体を包み、外部の物理攻撃によるダメージを40%軽減します。',
    flavorText: 'カンブリア紀の生存競争は苛烈を極める。喰らおうとする顎を弾き返す、無機質な鎧。',
    cost: 110,
    unlockedAtEra: 'PALEOZOIC',
    stats: { damageReduce: 0.4 }
  },
  {
    id: 'spikes',
    name: '防御トゲ (Defensive Spikes)',
    category: 'defense',
    description: '体表に鋭いトゲを形成。触れてきた敵に反撃ダメージ（カウンター）を与えて怯ませます。',
    flavorText: '「私を傷つければ、あなたもタダでは済まない」――攻撃への究極の抑止力。',
    cost: 100,
    unlockedAtEra: 'PALEOZOIC',
    stats: { spikes: 35, maxHp: 15 }
  },
  {
    id: 'amphibious_limbs',
    name: '両生四肢 (Amphibious Limbs)',
    category: 'movement',
    description: '強固な骨格と関節を持つ四肢。移動速度が向上し、潮溜まりや陸上での機動力を最大化します。',
    flavorText: '波打ち際を越え、重力という見えない鎖に抗って、誰もいない緑の大地へ這い上がる。',
    cost: 120,
    unlockedAtEra: 'PALEOZOIC',
    stats: { speed: 2.2, sensor: 50 }
  },

  // --- 中生代の進化 ---
  {
    id: 'endothermic_system',
    name: '温血・内温性システム (Endothermy)',
    category: 'metabolism',
    description: '自らの代謝熱で体温を常に一定に保つ。極端な熱さと寒さの双方に対する耐性を+50獲得。',
    flavorText: '環境の奴隷からの脱却。外の世界がどう変わろうとも、己の「炎」は常に一定に保ち続ける。',
    cost: 150,
    unlockedAtEra: 'MESOZOIC',
    stats: { heatResist: 50, coldResist: 50, maxHp: 30 }
  },
  {
    id: 'chromatophores',
    name: '擬態皮膚・色素胞 (Active Camouflage)',
    category: 'defense',
    description: '周囲 of 環境に同化して、敵の索敵から身を隠す。敵（捕食者）がプレイヤーを感知しにくくなります。',
    flavorText: '巨大な恐竜たちの影で、木漏れ日や落ち葉に溶け込み、息を潜めて嵐が過ぎるのを待つ。',
    cost: 130,
    unlockedAtEra: 'MESOZOIC',
    stats: { speed: 0.5, damageReduce: 0.15 } // 敵の追跡AI用パラメータは別途調整
  },
  {
    id: 'panoramic_eyes',
    name: '広角パノラマ眼 (Panoramic Vision)',
    category: 'sensory',
    description: '視野角と視力を劇的に向上させます。エサや敵の探知範囲を大幅に拡大（センサー半径+250）。',
    flavorText: '視覚の超進化。光と色の世界を完全に捉え、遠くの危機をいち早く察知する。',
    cost: 140,
    unlockedAtEra: 'MESOZOIC',
    stats: { sensor: 250, speed: 0.5 }
  },

  // --- 新生代の進化 ---
  {
    id: 'insulating_fur',
    name: '断熱体毛・毛皮 (Insulating Fur)',
    category: 'defense',
    description: '空気を蓄える極厚の毛皮。寒さに対する耐性を+95獲得し、氷河期の超低温を完全無効化します。',
    flavorText: '吹きすさぶ極寒のブリザード。白銀に閉ざされた世界を、暖かい毛皮の衣をまとって闊歩する。',
    cost: 180,
    unlockedAtEra: 'CENOZOIC',
    stats: { coldResist: 95, damageReduce: 0.2 }
  },
  {
    id: 'agile_reflexes',
    name: '俊敏な運動神経 (Hyper-Reflexes)',
    category: 'movement',
    description: '高度に発達した神経系と強靭な筋肉。移動速度が劇的に向上し、あらゆる危険を素早く回避します。',
    flavorText: '閃くように俊敏なステップ。敵がその存在を認識した時には、もう遥か彼方へと駆け抜けている。',
    cost: 160,
    unlockedAtEra: 'CENOZOIC',
    stats: { speed: 3.5 }
  },
  {
    id: 'proto_intelligence',
    name: '知性の萌芽 (Dawn of Intelligence)',
    category: 'sensory',
    description: '脳の巨大化と論理思考の獲得。センサー範囲+350。画面上の危険エリアや敵の移動方向を予測・表示可能にします。',
    flavorText: 'なぜ星は流れるのか、なぜ生命は死ぬのか。自問自答を始めたとき、生命は神の領域へ片足をかけた。',
    cost: 250,
    unlockedAtEra: 'CENOZOIC',
    stats: { sensor: 350, maxHp: 50, damageReduce: 0.3 }
  }
];

export const EXTINCTION_EVENTS: Record<string, ExtinctionEvent> = {
  GREAT_OXIDATION: {
    name: 'Great Oxidation Event',
    japaneseName: '大酸化破局イベント',
    description: 'シアノバクテリアの増殖により、有毒な酸素が大気と海洋に充満！「酸素呼吸システム」のない生命は生存の危機に瀕します。',
    effectText: '酸素濃度激増！酸素呼吸システム未所持の場合、酸素エリアで猛烈なスリップダメージ！',
    duration: 20,
    tempChange: -10,
    oxyChange: 60,
    toxChange: 40, // 酸素が毒として作用
    hazChange: 10,
    requiredEvolution: 'oxygen_respiration'
  },
  SNOWBALL_EARTH: {
    name: 'Snowball Earth',
    japaneseName: '全地球凍結（スノーボールアース）',
    description: '急激な寒冷化が進み、赤道から深海に至るまで地球全体が数百メートルの氷の下に閉ざされます。',
    effectText: '気温が-40℃まで急降下！「耐寒糖脂質シェル」がない場合、HPが急速に減少！エサの出現率激減！',
    duration: 25,
    tempChange: -90,
    oxyChange: -5,
    toxChange: 0,
    hazChange: 20,
    requiredEvolution: 'glycolipid_shell'
  },
  CAMBRIAN_EXPLOSION: {
    name: 'Cambrian Explosion',
    japaneseName: 'カンブリア紀生存競争爆発',
    description: '多様な捕食者が突如出現！巨大な牙と触手を持った外敵（アノマロカリス）が群れをなして襲いかかります。',
    effectText: '巨大なアノマロカリスが大量発生！逃げ切るか、「キチン質外骨格」や「トゲ」で耐え抜け！',
    duration: 30,
    tempChange: 5,
    oxyChange: 5,
    toxChange: 0,
    hazChange: 75,
    requiredEvolution: 'chitin_armor' // or spikes
  },
  PERMIAN_EXTINCTION: {
    name: 'Permian Extinction',
    japaneseName: 'P-T境界ペルム紀大量絶滅',
    description: '超巨大火山「シベリアントラップ」の大噴火！温室効果ガスにより地球は超高温化し、酸欠と有毒ガスに満ちた地獄と化します。',
    effectText: '気温+45℃！酸素激減＆毒性マックス！「温血性」や「耐熱二重膜」がないと生存困難！',
    duration: 25,
    tempChange: 45,
    oxyChange: -25,
    toxChange: 70,
    hazChange: 30,
    requiredEvolution: 'endothermic_system'
  },
  METEOR_IMPACT: {
    name: 'K-Pg Cretaceous Meteor Impact',
    japaneseName: '中生代末 白亜紀隕石衝突',
    description: '直径10kmの超巨大隕石がユカタン半島に激突！大爆発とともに塵が空を覆い尽くし、太陽光が完全に遮断されます。',
    effectText: '隕石の破片が降り注ぐ！全画面揺れ＆酸性雨！「温血性（恒温）」がないと急激な寒冷化で凍死！',
    duration: 30,
    tempChange: -50,
    oxyChange: -10,
    toxChange: 50,
    hazChange: 80,
    requiredEvolution: 'endothermic_system'
  },
  GLACIAL_CYCLE: {
    name: 'Quaternary Ice Age Cycle',
    japaneseName: '新生代 第四紀大氷河期',
    description: '地球全体の気温が低下し、巨大な氷床が中緯度地方まで前進。過酷な寒冷ブリザードと食糧難が生命を襲います。',
    effectText: '猛烈な吹雪と気温低下！「断熱体毛・毛皮」がない場合、HPが激しく削られます！',
    duration: 25,
    tempChange: -70,
    oxyChange: 0,
    toxChange: 0,
    hazChange: 40,
    requiredEvolution: 'insulating_fur'
  }
};
