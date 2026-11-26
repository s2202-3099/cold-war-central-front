# ずんだもん解説動画「中欧正面 1949–1991」

四国めたん（解説）とずんだもん（聞き役）の掛け合いで、冷戦期の中欧正面を解説する動画（Remotion）。

| コンポジション | 台本 | 内容 |
|---|---|---|
| `Part1` | `script/part1.txt` | 前編　二つの同盟が向かい合うまで（1945–1994の歴史） |
| `Part2` | `script/part2.txt` | 中編　作戦と計画（地形、ソ連とNATOの戦い方、公開された計画、側面、核） |
| `Part3` | `script/part3.txt` | 後編　もし戦っていたら（シミュレーターでの検証と評価論争） |
| `CentralFront` | `script/script.txt` | 最初に作った15分の1本版 |

## 構成

```
script/*.txt          台本。1行＝「話者[:声色]|画面|台詞」。画面は p:写真 s:シミュ画面 c:図解カード map:地図シーン
src/Video.tsx         動画本体（字幕・章の扉・写真のズームと注釈・カード・立ち絵・BGM・クレジット）
src/MapScene.tsx      地図アニメーション（侵攻軸の前進、渡河、核、出来事の一覧）
src/maps.ts           地図シーンの定義（どの想定を何日目から何日目まで、矢印や注記）
src/visuals.ts        図解カードとシミュ画面のメモ、写真の注釈
src/map/runs.json     tools/sim_runs.js がシミュレーターのモデルを回した結果
src/timeline/*.json   tools/tts.py が作る台詞ごとの開始フレーム・長さ・口パク
src/assets.json       立ち絵とBGMの設定（下記）
tools/                素材を作るスクリプト（下記）
```

## 作り直す手順

```sh
npm install                          # このフォルダ
(cd .. && npm install)               # シミュレーター側（d3 など）
docker run -d --name vv --network host voicevox/voicevox_engine:cpu-latest
python3 -I tools/fetch_direct.py     # 写真（Wikimedia Commons）と credits.json
node tools/capture_sim.js            # シミュ画面（playwright が必要）
node tools/sim_runs.js               # 地図シーン用にモデルを回す
python3 -I tools/tts.py part1        # 音声と timeline（part2, part3, single も同様）
python3 -I tools/fetch_fonts.py      # 台本を変えたら必ず作り直す（使う文字だけのフォント）
npx remotion studio                  # プレビュー
npx remotion render Part1 out/part1.mp4
```

読み間違いは `tools/tts.py` の `READ`（表記→読み）に足す。長い語ほど先に並べる（例：`FM100-5` を `M1` より前に）。

## 立ち絵とBGM

`src/assets.json` に書くと有効になる。ファイルは `public/` の下に置く。

```json
{
  "chars": {
    "z": {"closed": "chars/zundamon_closed.png", "open": "chars/zundamon_open.png", "height": 520},
    "m": {"closed": "chars/metan_closed.png", "open": "chars/metan_open.png", "height": 520}
  },
  "bgm": {"file": "bgm/track.mp3", "volume": 0.14, "duck": 0.05}
}
```

立ち絵は口を閉じた絵と開いた絵の2枚で、台詞の音量に合わせて切り替わる（左にめたん、右にずんだもん）。BGMはループし、話している間は `duck` の音量まで下がる。

## クレジットと注意

- 音声：VOICEVOX:ずんだもん、VOICEVOX:四国めたん（各キャラクターの利用規約に従う）
- 写真：Wikimedia Commons。パブリックドメイン以外（CC BY／CC BY-SA）は画面と最後のクレジットに作者とライセンスを表示。GFDLの画像は使っていない
- シミュレーターの数字は相対比較のための簡易モデルの結果で、予測ではない
