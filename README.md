# KodeQuest

Platform belajar fundamental pemrograman (HTML, CSS, JavaScript, React, PHP, MySQL, Python, Java, C++) dengan gamifikasi (XP, streak). Dibangun dengan Next.js (static export) dan Tailwind CSS v4, siap di-deploy ke GitHub Pages.

## Menjalankan lokal

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # hasil statis ada di folder out/
```

## Deploy ke GitHub Pages

1. Push proyek ini ke branch `main`.
2. Di repo: **Settings > Pages > Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` akan build dan publikasi otomatis. Base path (`/nama-repo`) diisi otomatis; untuk repo `nama-org.github.io` base path dikosongkan.

## Struktur

- `data/languages/<bahasa>.json` — semua soal per bahasa (pelajaran > soal, tiap soal punya `id` unik). Jenis soal: `mc`, `order`, `fill`, `type` (ketik manual: `preview`, `clue`, `answers`)
- `lib/data.ts` — tipe, daftar bahasa (`LANGUAGES`), dan helper `getLesson`, `getQuestion(id)`, `getQuestionsByType(type, langId?)`. Bahasa baru: tambah file JSON lalu daftarkan di sini
- `lib/theme.ts` — warna tiap bahasa
- `app/belajar/` — halaman pilih bahasa; `app/belajar/bahasa/[langId]/` — jalur belajar per bahasa; `app/belajar/[lessonId]/` — pelajaran
- `lib/store.tsx` — progres (XP, streak), localStorage, ekspor/impor JSON
- `lib/sound.ts` — efek suara Web Audio API
- `components/` — peta belajar, pemutar pelajaran, tipe soal, pengaturan
- `app/sandbox/` + `components/SandboxScreen.tsx` + `components/sandbox/` — halaman `/sandbox`: HTML/CSS/JS dengan pratinjau langsung, serta Python dan C++ yang berjalan di browser. Environment Python dan C++ baru dimuat saat tab-nya dibuka (ada layar "Menyiapkan environment")
- `lib/sandbox.ts`, `lib/useRuntime.ts` — kode awal, penyusun dokumen pratinjau, dan hook yang mengelola worker (muat, jalankan, hentikan)
- `public/vendor/py-worker.js` — worker Python (Pyodide diunduh dari CDN jsDelivr saat dibutuhkan, versi di `lib/sandbox.ts`)
- `public/vendor/cpp-worker.js` — worker C++ (JSCPP) hasil bundel; bangun ulang dengan `bash scripts/build-cpp-worker.sh`
