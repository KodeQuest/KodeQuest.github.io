#!/usr/bin/env bash
# Membangun public/vendor/cpp-worker.js (worker C++ berbasis JSCPP) tanpa menambah dependensi proyek.
# Jalankan dari root repo:  bash scripts/build-cpp-worker.sh
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp "$root/scripts/cpp-worker.src.js" "$root/scripts/shim-util.js" "$root/scripts/shim-stream.js" "$root/scripts/patch-jscpp.js" "$tmp/"
cd "$tmp"
npm init -y >/dev/null
npm install --no-audit --no-fund JSCPP@2.0.9 esbuild@0.25 >/dev/null
node patch-jscpp.js "$tmp"
npx esbuild cpp-worker.src.js --bundle --minify --format=iife --platform=browser \
  --alias:util=./shim-util.js --alias:stream=./shim-stream.js \
  --define:process.env.NODE_ENV='"production"' --outfile="$root/public/vendor/cpp-worker.js"
echo "OK: public/vendor/cpp-worker.js"
