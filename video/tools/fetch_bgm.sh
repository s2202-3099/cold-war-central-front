#!/usr/bin/env bash
# Download the BGM used in the videos from OpenTracks (formerly DOVA-SYNDROME) and normalize loudness.
# The audio files themselves are not committed (redistribution is not allowed by the licence).
# Usage (from video/): bash tools/fetch_bgm.sh
set -euo pipefail
OUT=public/bgm; mkdir -p "$OUT"; JAR=$(mktemp)
dl() { # id track name
  curl -s -A "Mozilla/5.0" -c "$JAR" -b "$JAR" -o /tmp/ot_page.html "https://opentracks.com/bgm/detail/$1/download"
  tok=$(grep -o 'name="csrfmiddlewaretoken" value="[^"]*"' /tmp/ot_page.html | head -1 | sed 's/.*value="//;s/"//')
  loc=$(curl -s -A "Mozilla/5.0" -c "$JAR" -b "$JAR" -e "https://opentracks.com/bgm/detail/$1/download" -X POST \
        --data-urlencode "csrfmiddlewaretoken=$tok" -d "track=$2" -D - -o /dev/null "https://opentracks.com/bgm/detail/$1/download" \
        | grep -i '^location' | sed 's/^[Ll]ocation: //' | tr -d '\r')
  curl -s -A "Mozilla/5.0" -o "$OUT/$3.src.mp3" "$loc"
  ffmpeg -v error -y -i "$OUT/$3.src.mp3" -af loudnorm=I=-20:TP=-2:LRA=11 -ar 48000 -c:a libmp3lame -b:a 192k "$OUT/$3.mp3"
  rm "$OUT/$3.src.mp3"; echo "$3"
}
dl 20942 1 monochrome_library   # shimtone「モノクロライブラリー」 前編
dl 16352 1 kousatsu             # shimtone「考察」 中編
dl 12192 2 sulpiride_loop       # Anonyment「Sulpiride」ループ版 後編
