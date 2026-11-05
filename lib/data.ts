export type MCQuestion = {
  type: "mc";
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type OrderQuestion = {
  type: "order";
  prompt: string;
  /** Potongan kode dalam urutan yang benar */
  pieces: string[];
  /** Potongan pengecoh (tidak dipakai) */
  decoys?: string[];
  explain: string;
};

export type FillQuestion = {
  type: "fill";
  prompt: string;
  /** Kode dengan satu bagian rumpang bertanda ___ */
  code: string;
  /** Jawaban yang diterima (tanpa membedakan huruf besar/kecil) */
  answers: string[];
  /** Pilihan kata (jawaban + pengecoh) */
  options: string[];
  explain: string;
};

export type Question = MCQuestion | OrderQuestion | FillQuestion;

export type Lesson = {
  id: string;
  title: string;
  icon: string;
  questions: Question[];
};

export type Unit = {
  id: string;
  title: string;
  subtitle: string;
  color: "emerald" | "indigo" | "amber";
  lessons: Lesson[];
};

const mc = (prompt: string, options: string[], answer: number, explain: string): MCQuestion => ({
  type: "mc",
  prompt,
  options,
  answer,
  explain,
});
const order = (prompt: string, pieces: string[], explain: string, decoys?: string[]): OrderQuestion => ({
  type: "order",
  prompt,
  pieces,
  decoys,
  explain,
});
const fill = (
  prompt: string,
  code: string,
  answers: string[],
  options: string[],
  explain: string
): FillQuestion => ({ type: "fill", prompt, code, answers, options, explain });

export const UNITS: Unit[] = [
  {
    id: "html",
    title: "Unit 1 · HTML",
    subtitle: "Kerangka halaman web",
    color: "emerald",
    lessons: [
      {
        id: "html-1",
        title: "Struktur Dasar",
        icon: "🏗️",
        questions: [
          mc("Apa kepanjangan HTML?", ["HyperText Markup Language", "High Tech Modern Language", "Hyperlink Text Making Logic", "Home Tool Markup Language"], 0, "HTML adalah HyperText Markup Language, bahasa penanda untuk struktur halaman web."),
          mc("Tag mana yang berisi seluruh konten yang tampil di halaman?", ["<head>", "<body>", "<title>", "<meta>"], 1, "<body> memuat semua yang terlihat oleh pengunjung."),
          order("Susun kerangka dokumen HTML yang benar.", ["<html>", "<head>", "<title>Halo</title>", "</head>", "<body>", "</body>", "</html>"], "Urutannya: html → head (berisi title) → body."),
          order("Susun sebuah paragraf.", ["<p>", "Selamat belajar", "</p>"], "Tag pembuka, isi, lalu tag penutup.", ["<br>"]),
          fill("Lengkapi deklarasi tipe dokumen.", "<!___ html>", ["DOCTYPE"], ["DOCTYPE", "HTML", "TYPE", "DOC"], "<!DOCTYPE html> memberi tahu browser bahwa ini HTML5."),
          fill("Tag untuk judul tab browser:", "<head>\n  <___>KodeQuest</title>\n</head>", ["title"], ["title", "h1", "name", "header"], "<title> menentukan teks pada tab browser."),
        ],
      },
      {
        id: "html-2",
        title: "Teks & Tautan",
        icon: "🔗",
        questions: [
          mc("Tag judul terbesar dan terpenting adalah…", ["<h6>", "<h1>", "<head>", "<big>"], 1, "<h1> adalah heading level tertinggi."),
          mc("Atribut yang menyimpan alamat tujuan pada tautan adalah…", ["src", "link", "href", "url"], 2, "Atribut href pada <a> berisi tujuan tautan."),
          order("Susun sebuah tautan.", ['<a href="https://github.com">', "Buka GitHub", "</a>"], "Tag <a> dengan href membungkus teks tautan."),
          order("Susun teks tebal di dalam paragraf.", ["<p>", "Ini ", "<strong>", "penting", "</strong>", "</p>"], "<strong> membuat teks ditekankan (tebal)."),
          fill("Lengkapi tautan.", '<a ___="https://example.com">Contoh</a>', ["href"], ["href", "src", "link", "to"], "Gunakan href untuk alamat tautan."),
          fill("Tag untuk teks miring (penekanan):", "<___>Hati-hati</em>", ["em"], ["em", "b", "u", "small"], "<em> menandai penekanan, biasanya tampil miring."),
        ],
      },
      {
        id: "html-3",
        title: "Daftar & Gambar",
        icon: "🖼️",
        questions: [
          mc("Tag yang membuat daftar berbutir (bullet) adalah…", ["<ol>", "<ul>", "<li>", "<dl>"], 1, "<ul> = unordered list, <ol> = ordered list."),
          mc("Atribut wajib pada <img> untuk menunjuk file gambar adalah…", ["href", "alt", "src", "path"], 2, "src berisi lokasi gambar; alt berisi teks alternatif."),
          order("Susun daftar dengan dua item.", ["<ul>", "<li>HTML</li>", "<li>CSS</li>", "</ul>"], "Setiap item daftar memakai <li> di dalam <ul>."),
          order("Susun sebuah gambar.", ["<img", 'src="kucing.png"', 'alt="Kucing lucu"', "/>"], "Gambar memakai src dan sebaiknya alt.", ['href="kucing.png"']),
          fill("Lengkapi daftar bernomor.", "<___>\n  <li>Satu</li>\n  <li>Dua</li>\n</ol>", ["ol"], ["ol", "ul", "li", "list"], "<ol> menampilkan nomor otomatis."),
          fill("Teks pengganti saat gambar gagal dimuat:", '<img src="a.png" ___="Logo">', ["alt"], ["alt", "title", "text", "name"], "Atribut alt penting untuk aksesibilitas."),
        ],
      },
      {
        id: "html-4",
        title: "Formulir",
        icon: "📝",
        questions: [
          mc("Tag yang membungkus kolom isian pengguna adalah…", ["<form>", "<table>", "<section>", "<fieldset>"], 0, "<form> mengelompokkan input untuk dikirim."),
          mc("Tipe input untuk menyembunyikan karakter saat mengetik?", ['type="text"', 'type="hidden"', 'type="password"', 'type="secret"'], 2, "type=\"password\" menampilkan titik pengganti karakter."),
          order("Susun sebuah label dan input.", ['<label for="nama">', "Nama", "</label>", '<input id="nama" type="text">'], "label terhubung ke input lewat for dan id."),
          order("Susun tombol kirim di dalam form.", ["<form>", '<button type="submit">', "Kirim", "</button>", "</form>"], "Tombol submit mengirim isi form."),
          fill("Lengkapi input email.", '<input type="___">', ["email"], ["email", "mail", "text", "address"], "type=\"email\" memvalidasi format email."),
          fill("Atribut agar kolom wajib diisi:", '<input type="text" ___>', ["required"], ["required", "must", "needed", "fill"], "required mencegah form terkirim bila kosong."),
        ],
      },
    ],
  },
  {
    id: "css",
    title: "Unit 2 · CSS",
    subtitle: "Gaya dan tata letak",
    color: "indigo",
    lessons: [
      {
        id: "css-1",
        title: "Selektor & Warna",
        icon: "🎨",
        questions: [
          mc("Apa fungsi CSS?", ["Mengatur tampilan halaman", "Menyimpan data", "Membuat logika program", "Mengirim email"], 0, "CSS (Cascading Style Sheets) mengatur tampilan."),
          mc("Selektor untuk elemen ber-class \"kartu\" adalah…", ["#kartu", ".kartu", "kartu", "*kartu"], 1, "Titik (.) menandai class, tanda pagar (#) menandai id."),
          order("Susun aturan CSS yang benar.", ["p", "{", "color: red;", "}"], "Selektor, kurung kurawal, deklarasi, tutup."),
          order("Susun warna latar.", ["body", "{", "background-color: #fff;", "}"], "Properti dan nilai dipisah titik dua dan diakhiri titik koma.", ["background-color = #fff;"]),
          fill("Ubah warna teks menjadi biru.", "h1 { ___: blue; }", ["color"], ["color", "text", "font-color", "fill"], "Properti color mengubah warna teks."),
          fill("Selektor id bernama menu:", "___menu { margin: 0; }", ["#"], ["#", ".", "@", "&"], "Tanda # dipakai untuk id."),
        ],
      },
      {
        id: "css-2",
        title: "Box Model",
        icon: "📦",
        questions: [
          mc("Urutan lapisan box model dari dalam ke luar:", ["content, padding, border, margin", "content, margin, border, padding", "padding, content, border, margin", "border, padding, content, margin"], 0, "Isi → padding → border → margin."),
          mc("Properti untuk ruang DI DALAM border adalah…", ["margin", "gap", "padding", "spacing"], 2, "padding = jarak isi ke border; margin = jarak ke luar."),
          order("Susun aturan kotak.", [".kotak", "{", "padding: 16px;", "border: 1px solid;", "}"], "Beberapa deklarasi bisa berada dalam satu aturan."),
          order("Susun margin otomatis agar rata tengah.", [".wadah", "{", "width: 600px;", "margin: 0 auto;", "}"], "margin 0 auto memusatkan blok yang memiliki lebar."),
          fill("Beri jarak luar 20px.", ".a { ___: 20px; }", ["margin"], ["margin", "padding", "gap", "space"], "margin mengatur jarak di luar elemen."),
          fill("Sudut membulat:", ".btn { border-___: 8px; }", ["radius"], ["radius", "round", "corner", "curve"], "border-radius membulatkan sudut."),
        ],
      },
      {
        id: "css-3",
        title: "Flexbox",
        icon: "🧩",
        questions: [
          mc("Nilai display untuk mengaktifkan flexbox:", ["block", "flex", "inline", "grid"], 1, "display: flex menjadikan elemen flex container."),
          mc("Properti untuk merapikan item di sumbu utama:", ["align-items", "justify-content", "flex-wrap", "order"], 1, "justify-content mengatur sumbu utama; align-items sumbu silang."),
          order("Susun flex container yang memusatkan isi.", [".baris", "{", "display: flex;", "justify-content: center;", "}"], "Aktifkan flex dulu, lalu atur perataan."),
          order("Susun flex arah kolom.", [".kolom", "{", "display: flex;", "flex-direction: column;", "}"], "flex-direction: column menyusun item vertikal.", ["flex-direction: wrap;"]),
          fill("Beri jarak antar item flex.", ".baris { display: flex; ___: 12px; }", ["gap"], ["gap", "margin", "space", "pad"], "gap memberi jarak antar item tanpa margin tambahan."),
          fill("Pusatkan item secara vertikal.", ".baris { display: flex; ___-items: center; }", ["align"], ["align", "justify", "vertical", "center"], "align-items: center memusatkan di sumbu silang."),
        ],
      },
    ],
  },
  {
    id: "js",
    title: "Unit 3 · JavaScript",
    subtitle: "Logika dan interaksi",
    color: "amber",
    lessons: [
      {
        id: "js-1",
        title: "Variabel & Tipe",
        icon: "📌",
        questions: [
          mc("Kata kunci untuk variabel yang nilainya tidak boleh diganti:", ["var", "let", "const", "fixed"], 2, "const dipakai untuk referensi yang tidak diubah."),
          mc("Hasil dari typeof \"halo\" adalah…", ['"text"', '"string"', '"char"', '"word"'], 1, "Teks bertipe string."),
          order("Susun deklarasi variabel.", ["let", "skor", "=", "10;"], "let nama = nilai;"),
          order("Susun pesan ke konsol.", ["console", ".log(", '"Halo"', ");"], "console.log mencetak ke konsol.", ["print("]),
          fill("Lengkapi deklarasi konstanta.", "___ PI = 3.14;", ["const"], ["const", "let", "var", "set"], "PI tidak perlu berubah, jadi pakai const."),
          fill("Gabungkan teks dengan template string:", "const s = `Halo, ${___}`;", ["nama"], ["nama", '"nama"', "$nama", "{nama}"], "Di dalam ${ } kita menulis ekspresi atau variabel."),
        ],
      },
      {
        id: "js-2",
        title: "Fungsi & Kondisi",
        icon: "⚙️",
        questions: [
          mc("Kata kunci untuk mengembalikan nilai dari fungsi:", ["give", "return", "output", "send"], 1, "return mengembalikan hasil ke pemanggil."),
          mc("Operator untuk perbandingan ketat (nilai dan tipe sama):", ["=", "==", "===", "=>"], 2, "=== membandingkan nilai sekaligus tipe."),
          order("Susun fungsi penjumlahan.", ["function tambah(a, b)", "{", "return a + b;", "}"], "Fungsi punya nama, parameter, dan badan."),
          order("Susun kondisi if-else.", ["if (umur >= 17)", "{ masuk(); }", "else", "{ tolak(); }"], "if menjalankan blok bila benar; else bila tidak.", ["elif"]),
          fill("Lengkapi fungsi panah.", "const kali = (a, b) ___ a * b;", ["=>"], ["=>", "->", "=", "::"], "Fungsi panah memakai =>."),
          fill("Hasil dari 7 % 3 adalah…", "console.log(7 % 3); // ___", ["1"], ["0", "1", "2", "3"], "% adalah sisa bagi: 7 dibagi 3 bersisa 1."),
        ],
      },
      {
        id: "js-3",
        title: "Array & Perulangan",
        icon: "🔁",
        questions: [
          mc("Indeks elemen pertama array di JavaScript adalah…", ["0", "1", "-1", "first"], 0, "Indeks array dimulai dari 0."),
          mc("Method untuk menambah elemen di akhir array:", ["push()", "pop()", "shift()", "add()"], 0, "push menambah di akhir; pop menghapus dari akhir."),
          order("Susun array buah.", ["const buah", "=", '["apel", "jeruk"]', ";"], "Array ditulis dalam kurung siku."),
          order("Susun perulangan for.", ["for (let i = 0;", "i < 3;", "i++)", "{ console.log(i); }"], "for punya inisialisasi, kondisi, dan langkah.", ["i--)"]),
          fill("Panjang array:", "const n = buah.___;", ["length"], ["length", "size", "count", "len()"], "Properti length memberi jumlah elemen."),
          fill("Ubah setiap elemen:", "const dua = [1, 2, 3].___(x => x * 2);", ["map"], ["map", "filter", "forEach", "reduce"], "map mengembalikan array baru hasil transformasi."),
        ],
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = UNITS.flatMap((u) => u.lessons);
