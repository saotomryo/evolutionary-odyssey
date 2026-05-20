# 大絶滅イベントの精密背景画像の設定方法 / How to Setup High-Precision Extinction Event Images

このディレクトリには、大絶滅イベントの際に表示される、外部の画像生成AI（DALL-E 3, Midjourney, Stable Diffusion など）で作成した超高精細・精密な「想像風景画像」を配置することができます。

画像を配置すると、ゲーム内で自動的に検出されて美麗なイラストが表示されます。画像が配置されていない場合は、安全性のために自動的に「動的なネオン風SVGアニメーション」がフォールバックとして表示されます。

---

## 📸 配置する画像のファイル名と対応イベント (Image File Names & Events)

以下のファイル名（`.png` 形式推奨）で、このディレクトリに画像を保存してください。

1. **大酸化破局 (Great Oxidation Event)**
   - ファイル名: `great_oxidation.png`
   - 推奨プロンプト例:
     > A highly detailed, realistic digital painting of the prehistoric ocean during the Great Oxidation Event. Cyanobacteria blooming in massive clusters, releasing millions of intense green-blue neon oxygen bubbles rising from deep-sea volcanic hydrothermal vents. Glowing cyan and emerald mystical light rays piercing down from the ancient sea surface. Scientific, biological fantasy, cinematic lighting, 8k resolution, no device frame, no text.

2. **全地球凍結 (Snowball Earth)**
   - ファイル名: `snowball_earth.png`
   - 推奨プロンプト例:
     > A dramatic and photorealistic wide landscape of the Snowball Earth epoch. The entire planet is covered under hundreds of meters of solid crystal ice and massive glaciers, under a dark, freezing twilight sky. Fierce blizzard and swirling snowstorms sweeps across the white endless icy desert. Cold pale blue and neon cyan ambient light, highly detailed frost textures, 8k resolution, cinematic atmosphere, no text.

3. **カンブリア紀生存競争爆発 (Cambrian Explosion)**
   - ファイル名: `cambrian_explosion.png`
   - 推奨プロンプト例:
     > An immersive under-ocean digital painting of the Cambrian Explosion. Hostile prehistoric predators, with a giant, terrifying Anomalocaris swimming near deep-sea coral reefs. Waving vibrant neon-pink and purple tentacles of ancient organisms, primitive glowing marine lifeforms scattering away in panic. High-contrast shafts of sunlight piercing down, extreme details of scales and ancient ecology, 8k resolution, no text.

4. **P-T境界ペルム紀大量絶滅 (Permian Extinction)**
   - ファイル名: `permian_extinction.png`
   - 推奨プロンプト例:
     > A devastating apocalyptic landscape of the Permian Extinction (P-T boundary). The colossal Siberian Traps volcanoes erupting violently, spewing massive rivers of glowing orange and yellow liquid lava down black volcanic mountains. The sky is completely choked with thick, swirling yellow toxic sulfur gas and dark ash clouds. Glowing embers and volcanic sparks floating in the air, high contrast, dramatic light, 8k resolution, no text.

5. **中生代末 白亜紀隕石衝突 (Cretaceous Meteor Impact)**
   - ファイル名: `meteor_impact.png`
   - 推奨プロンプト例:
     > A majestic, terrifying, photorealistic moment of a giant asteroid impact (K-Pg boundary). A massive 10km flaming asteroid tearing down through a dark crimson sky, leaving a brilliant golden-orange trail of fire. A colossal ring of shockwaves and expanding impact blast waves spreading across ancient jungles and primeval oceans. Giant dinosaurs silhouetted in the distance, highly dramatic apocalyptic masterpiece, 8k resolution, no text.

6. **新生代 第四紀大氷河期 (Quaternary Ice Age Cycle)**
   - ファイル名: `glacial_cycle.png`
   - 推奨プロンプト例:
     > A detailed scenic digital art of the Quaternary Ice Age. Massive, sharp blue glaciers and ice sheets rising to the sky. A herd of ancient woolly Mammoths walking through a white snowy valley, while a violent howling blizzard sweeps across the frozen wasteland. Frost frames, cold dramatic volumetric light, high-end concept art, 8k resolution, no text.

7. **【PROLOGUE】生命の起源 (Origin of Life)**
   - ファイル名: `origin_of_life.png`
   - 推奨プロンプト例:
     > A photorealistic, hyper-detailed wide landscape of the Hadean Earth 4.6 billion years ago. The dark violet sky is filled with colossal lightning storms and dramatic crimson clouds. On the turbulent prebiotic ocean surface, glowing geothermal hydrothermal vents (black smokers) spew toxic black steam and minerals. Floating fluorescent organic soup of self-replicating molecules and glowing neon DNA/RNA helices swirl in the bubbling glowing green and purple chemical water. Volumetric rays, cinematic masterwork, 8k resolution, no text.

8. **【GAME CLEAR】究極生命体：ネオ・サピエンスへの到達 (Ultimate Evolution: Neo Sapiens)**
   - ファイル名: `neo_sapiens.png`
   - 推奨プロンプト例:
     > A premium, stunning concept art of a futuristic transcendent being: Neo Sapiens, the ultimate evolved form of life. A majestic, cybernetic-organic post-human figure glowing with gold and cyan bio-luminescent networks under its translucent skin. Floating gracefully in a high-tech crystal-glass cocoon, surrounded by double helices of pure golden light and swirling stellar dust of a distant future galaxy. Ethereal, godlike presence, flawless cybernetic design, ultra-realistic textures, cinematic lighting, 8k resolution, no text.

---

## 🎨 推奨される画像仕様 (Recommended Image Specifications)

- **画像サイズ (Resolution)**: `1200 x 520` ピクセル以上（アスペクト比 約 `2.3 : 1` または `16:9`）
  - モーダル表示領域（アスペクト比 `600 x 260`）に合わせて自動的に `object-fit: cover` 処理され、美しくトリミングされて表示されます。
- **フォーマット (Format)**: `.png` 形式 (もし `.jpg` や `.jpeg` などを利用したい場合は、コードが拡張子を自動判定またはフォールバックできるようにしています)
- **スタイル (Design Theme)**: ダークモードやネオンサイバー調のゲームデザインに合う、高コントラストでドラマチックな色調のイラストが最適です。
