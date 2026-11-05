# KodeQuest

Platform belajar fundamental HTML, CSS, dan JavaScript dengan gamifikasi (XP, hati, streak). Dibangun dengan Next.js (static export) dan Tailwind CSS v4, siap di-deploy ke GitHub Pages.

## Menjalankan lokal

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # hasil statis ada di folder out/
```

## Deploy ke GitHub Pages

1. Push proyek ini ke branch `main`.
2. Di repo: **Settings → Pages → Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` akan build dan publikasi otomatis. Base path (`/nama-repo`) diisi otomatis; untuk repo `nama-org.github.io` base path dikosongkan.

## Struktur

- `lib/data.ts` — semua unit, pelajaran, dan soal (tambah materi di sini)
- `lib/store.tsx` — progres (XP, hati, streak), localStorage, ekspor/impor JSON
- `lib/sound.ts` — efek suara Web Audio API
- `components/` — peta belajar, pemutar pelajaran, tipe soal, pengaturan
