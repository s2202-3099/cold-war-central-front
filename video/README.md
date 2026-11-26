# ずんだもん解説動画「中欧正面 1949–1991」

四国めたん（解説）とずんだもん（聞き役）の掛け合いで、冷戦期の中欧正面の戦略・計画と、親フォルダのシミュレーターでの検証を解説する約15分の動画（Remotion）。

## 構成

```
script/script.txt     台本（話者|画面|台詞）。画面は p:写真 s:シミュ画面 c:図解カード
src/visuals.ts        シミュ画面のメモと図解カードの中身
src/Video.tsx         動画本体（字幕・章の扉・写真のズーム・クレジット）
src/timeline.json     tools/tts.py が作る台詞ごとの開始フレームと長さ
tools/tts.py          VOICEVOX で台詞を音声化し timeline.json を作る（読み替え辞書つき）
tools/photo_list.py   使う写真（Wikimedia Commons）とライセンス・作者
tools/fetch_direct.py 写真を取得し public/photos/credits.json を作る
tools/capture_sim.js  シミュレーター（../index.html）の画面を撮る
tools/fetch_fonts.py  動画で使う文字だけのフォント（M PLUS Rounded 1c・Noto Sans JP）を取得
```

## 作り直す手順

```sh
npm install                       # このフォルダ
(cd .. && npm install)            # シミュレーター側（画面撮影に d3 などを使う）
docker run -d --network host voicevox/voicevox_engine:cpu-latest
python3 -I tools/fetch_direct.py  # 写真
node tools/capture_sim.js         # シミュ画面（playwright が必要）
python3 -I tools/tts.py           # 音声と timeline.json
python3 -I tools/fetch_fonts.py   # 台本を変えたらフォントも作り直す
npx remotion studio               # プレビュー
npx remotion render CentralFront out/central-front.mp4
```

## クレジットと注意

- 音声：VOICEVOX:ずんだもん、VOICEVOX:四国めたん（各キャラクターの利用規約に従う）
- 写真：Wikimedia Commons。パブリックドメイン以外（CC BY／CC BY-SA）は画面と最後のクレジットに作者とライセンスを表示
- シミュレーターの数字は相対比較のための簡易モデルの結果で、予測ではない
