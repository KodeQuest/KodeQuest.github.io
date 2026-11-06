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
  questions: Question[];
};

export type LanguageColor = "emerald" | "indigo" | "amber" | "sky" | "rose" | "violet";

export type Language = {
  id: string;
  /** Nama bahasa yang tampil di kartu dan banner */
  title: string;
  subtitle: string;
  /** Singkatan pendek untuk lencana kartu (mis. "Py") */
  badge: string;
  color: LanguageColor;
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

export const LANGUAGES: Language[] = [
  {
    id: "html",
    title: "HTML",
    subtitle: "Kerangka halaman web",
    badge: "</>",
    color: "emerald",
    lessons: [
      {
        id: "html-1",
        title: "Struktur Dasar",
        questions: [
          mc("Apa kepanjangan HTML?", ["HyperText Markup Language", "High Tech Modern Language", "Hyperlink Text Making Logic", "Home Tool Markup Language"], 0, "HTML adalah HyperText Markup Language, bahasa penanda untuk struktur halaman web."),
          mc("Tag mana yang berisi seluruh konten yang tampil di halaman?", ["<head>", "<body>", "<title>", "<meta>"], 1, "<body> memuat semua yang terlihat oleh pengunjung."),
          order("Susun kerangka dokumen HTML yang benar.", ["<html>", "<head>", "<title>Halo</title>", "</head>", "<body>", "</body>", "</html>"], "Urutannya: html > head (berisi title) > body."),
          order("Susun sebuah paragraf.", ["<p>", "Selamat belajar", "</p>"], "Tag pembuka, isi, lalu tag penutup.", ["<br>"]),
          fill("Lengkapi deklarasi tipe dokumen.", "<!___ html>", ["DOCTYPE"], ["DOCTYPE", "HTML", "TYPE", "DOC"], "<!DOCTYPE html> memberi tahu browser bahwa ini HTML5."),
          fill("Tag untuk judul tab browser:", "<head>\n  <___>KodeQuest</title>\n</head>", ["title"], ["title", "h1", "name", "header"], "<title> menentukan teks pada tab browser."),
        ],
      },
      {
        id: "html-2",
        title: "Teks & Tautan",
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
    title: "CSS",
    subtitle: "Gaya dan tata letak",
    badge: "{ }",
    color: "indigo",
    lessons: [
      {
        id: "css-1",
        title: "Selektor & Warna",
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
        questions: [
          mc("Urutan lapisan box model dari dalam ke luar:", ["content, padding, border, margin", "content, margin, border, padding", "padding, content, border, margin", "border, padding, content, margin"], 0, "Isi > padding > border > margin."),
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
    title: "JavaScript",
    subtitle: "Logika dan interaksi",
    badge: "JS",
    color: "amber",
    lessons: [
      {
        id: "js-1",
        title: "Variabel & Tipe",
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
  {
    id: "python",
    title: "Python",
    subtitle: "Sintaks ringkas, cocok untuk pemula",
    badge: "Py",
    color: "sky",
    lessons: [
      {
        id: "python-1",
        title: "Dasar Python",
        questions: [
          mc("Fungsi untuk menampilkan teks ke layar di Python adalah…", ["echo()", "print()", "console.log()", "write()"], 1, "print() mencetak nilai ke layar."),
          mc("Tipe data dari 3.14 adalah…", ["int", "str", "float", "bool"], 2, "Bilangan desimal bertipe float."),
          order("Susun pesan ke layar.", ["print(", '"Halo"', ")"], "print dipanggil dengan teks di dalam kurung."),
          order("Susun deklarasi variabel.", ["nama", "=", '"Budi"'], "Python tidak butuh kata kunci khusus untuk membuat variabel.", ["let"]),
          fill("Komentar satu baris di Python diawali dengan…", "___ ini komentar", ["#"], ["#", "//", "--", "/*"], "Python memakai tanda # untuk komentar."),
          fill("Ubah teks menjadi bilangan bulat.", 'angka = ___("42")', ["int"], ["int", "str", "float", "num"], "int() mengubah nilai menjadi bilangan bulat."),
        ],
      },
      {
        id: "python-2",
        title: "Kondisi & Perulangan",
        questions: [
          mc("Python menandai blok kode dengan…", ["kurung kurawal", "indentasi", "titik koma", "BEGIN dan END"], 1, "Indentasi (spasi di awal baris) menentukan blok kode."),
          mc("Kata kunci untuk cabang kedua setelah if adalah…", ["else if", "elseif", "elif", "otherwise"], 2, "elif adalah singkatan dari else if."),
          order("Susun kondisi if.", ["if umur >= 17:", 'print("Boleh")'], "Baris if diakhiri titik dua, lalu isi blok."),
          order("Susun perulangan for.", ["for i in range(3):", "print(i)"], "range(3) menghasilkan 0, 1, 2.", ["for (i = 0; i < 3; i++)"]),
          fill("Ulangi selama kondisi benar.", "___ x < 5:\n    x += 1", ["while"], ["while", "for", "if", "loop"], "while mengulang selama kondisinya True."),
          fill("Lengkapi keluaran perulangan.", "for i in range(3):\n    print(i)  # 0, 1, ___", ["2"], ["1", "2", "3", "4"], "range(3) berhenti sebelum angka 3."),
        ],
      },
      {
        id: "python-3",
        title: "Fungsi & List",
        questions: [
          mc("Kata kunci untuk membuat fungsi di Python adalah…", ["function", "def", "fun", "func"], 1, "Fungsi dibuat dengan def."),
          mc("Hasil dari len([4, 5, 6]) adalah…", ["2", "3", "4", "6"], 1, "len() menghitung jumlah elemen: ada 3."),
          order("Susun sebuah fungsi.", ["def tambah(a, b):", "return a + b"], "def, nama, parameter, titik dua, lalu isi fungsi."),
          order("Susun penambahan elemen list.", ['buah = ["apel"]', 'buah.append("jeruk")'], "append menambah elemen di akhir list.", ['buah.push("jeruk")']),
          fill("Lengkapi pembuatan fungsi.", "___ sapa(nama):\n    return nama", ["def"], ["def", "fn", "func", "lambda"], "Gunakan def untuk mendefinisikan fungsi."),
          fill("Ambil elemen pertama list.", 'buah = ["apel", "jeruk"]\nprint(buah[___])', ["0"], ["0", "1", "2", "first"], "Indeks list dimulai dari 0."),
        ],
      },
    ],
  },
  {
    id: "java",
    title: "Java",
    subtitle: "Bahasa berorientasi objek yang kokoh",
    badge: "Jv",
    color: "rose",
    lessons: [
      {
        id: "java-1",
        title: "Struktur Program",
        questions: [
          mc("Titik masuk program Java adalah method…", ["start()", "main()", "run()", "init()"], 1, "JVM menjalankan program dari method main."),
          mc("Ekstensi file kode sumber Java adalah…", [".java", ".class", ".jar", ".js"], 0, ".java adalah kode sumber; .class adalah hasil kompilasi."),
          order("Susun perintah cetak.", ["System.out.println(", '"Halo"', ");"], "System.out.println mencetak teks lalu pindah baris."),
          order("Susun method main.", ["public static void main(String[] args)", "{", 'System.out.println("Hi");', "}"], "Method main punya tanda tangan yang tetap."),
          fill("Lengkapi deklarasi kelas.", "public ___ Halo { }", ["class"], ["class", "void", "static", "main"], "Semua kode Java berada di dalam class."),
          fill("Setiap pernyataan Java diakhiri dengan…", 'System.out.println("a")___', [";"], [";", ":", ".", ","], "Titik koma menutup pernyataan."),
        ],
      },
      {
        id: "java-2",
        title: "Tipe Data & Kondisi",
        questions: [
          mc("Tipe untuk bilangan bulat adalah…", ["int", "String", "boolean", "double"], 0, "int menyimpan bilangan bulat."),
          mc("Tipe yang hanya bernilai true atau false adalah…", ["bool", "boolean", "binary", "flag"], 1, "Di Java namanya boolean."),
          order("Susun deklarasi variabel.", ["int", "umur", "=", "20;"], "Tipe, nama, tanda sama dengan, nilai."),
          order("Susun if-else.", ["if (nilai >= 70)", '{ System.out.println("Lulus"); }', "else", '{ System.out.println("Ulang"); }'], "else menangani kondisi yang tidak terpenuhi.", ["elif"]),
          fill("Deklarasikan variabel teks.", '___ nama = "Sari";', ["String"], ["String", "string", "text", "char"], "Tipe teks di Java ditulis String dengan S besar."),
          fill("Operator untuk membandingkan kesamaan:", "if (a ___ b) { }", ["=="], ["==", "=", "=>", "==="], "== membandingkan, sedangkan = memberi nilai."),
        ],
      },
      {
        id: "java-3",
        title: "Perulangan & Array",
        questions: [
          mc("Cara mengambil panjang array arr adalah…", ["arr.length", "arr.length()", "arr.size()", "len(arr)"], 0, "Array memakai properti length tanpa kurung."),
          mc("Kata kunci untuk keluar dari perulangan adalah…", ["exit", "break", "stop", "leave"], 1, "break menghentikan perulangan."),
          order("Susun perulangan for.", ["for (int i = 0;", "i < 3;", "i++)", "{ System.out.println(i); }"], "Inisialisasi, kondisi, langkah.", ["i--)"]),
          order("Susun deklarasi array.", ["int[]", "angka", "=", "{1, 2, 3};"], "Array diisi dengan kurung kurawal."),
          fill("Buat array int berukuran 5.", "int[] a = new ___[5];", ["int"], ["int", "Int", "array", "String"], "new int[5] membuat array berisi lima bilangan bulat."),
          fill("Ulangi selama kondisi benar.", "___ (x < 10) { x++; }", ["while"], ["while", "for", "if", "loop"], "while mengulang selama kondisinya true."),
        ],
      },
    ],
  },
  {
    id: "cpp",
    title: "C++",
    subtitle: "Cepat dan dekat dengan perangkat keras",
    badge: "C++",
    color: "violet",
    lessons: [
      {
        id: "cpp-1",
        title: "Struktur Program",
        questions: [
          mc("Header yang dibutuhkan untuk memakai cout adalah…", ["<iostream>", "<stdio>", "<cout>", "<io>"], 0, "<iostream> menyediakan cin dan cout."),
          mc("Fungsi utama program C++ bernama…", ["start", "main", "run", "program"], 1, "Eksekusi dimulai dari main()."),
          order("Susun perintah cetak.", ["std::cout", "<<", '"Halo"', "<<", "std::endl;"], "cout memakai operator << untuk mengirim data.", [">>"]),
          order("Susun fungsi main.", ["int main()", "{", "return 0;", "}"], "main mengembalikan 0 bila program berhasil."),
          fill("Lengkapi direktif impor header.", "#___ <iostream>", ["include"], ["include", "import", "using", "require"], "#include menyertakan header."),
          fill("Setiap pernyataan C++ diakhiri dengan…", "int x = 5___", [";"], [";", ":", ".", ","], "Titik koma menutup pernyataan."),
        ],
      },
      {
        id: "cpp-2",
        title: "Variabel & Kondisi",
        questions: [
          mc("Tipe untuk bilangan desimal berpresisi ganda adalah…", ["int", "char", "double", "bool"], 2, "double menyimpan bilangan desimal."),
          mc("Objek untuk membaca input dari keyboard adalah…", ["cin", "cout", "read", "get"], 0, "std::cin membaca input dengan operator >>."),
          order("Susun deklarasi variabel.", ["int", "umur", "=", "20;"], "Tipe, nama, tanda sama dengan, nilai."),
          order("Susun if-else.", ["if (x > 0)", '{ std::cout << "Positif"; }', "else", '{ std::cout << "Bukan"; }'], "else menangani sisanya.", ["elif"]),
          fill("Operator untuk membaca input:", "std::cin ___ x;", [">>"], [">>", "<<", "=", "->"], "cin memakai >>, sedangkan cout memakai <<."),
          fill("Tipe untuk teks:", 'std::___ nama = "Ani";', ["string"], ["string", "String", "text", "char"], "std::string menyimpan teks."),
        ],
      },
      {
        id: "cpp-3",
        title: "Perulangan & Fungsi",
        questions: [
          mc("Tipe kembalian untuk fungsi yang tidak mengembalikan nilai adalah…", ["null", "void", "empty", "none"], 1, "void berarti tidak ada nilai yang dikembalikan."),
          mc("Hasil dari 10 / 3 jika keduanya bertipe int adalah…", ["3", "3.33", "4", "3.0"], 0, "Pembagian bilangan bulat membuang bagian pecahan."),
          order("Susun perulangan for.", ["for (int i = 0;", "i < 3;", "i++)", "{ std::cout << i; }"], "Inisialisasi, kondisi, langkah.", ["i--)"]),
          order("Susun fungsi penjumlahan.", ["int tambah(int a, int b)", "{", "return a + b;", "}"], "Fungsi punya tipe kembalian, nama, parameter, dan badan."),
          fill("Fungsi tanpa nilai kembalian.", "___ sapa() { }", ["void"], ["void", "def", "function", "var"], "Tipe void dipakai bila fungsi tidak mengembalikan apa pun."),
          fill("Ulangi selama kondisi benar.", "___ (n > 0) { n--; }", ["while"], ["while", "for", "if", "do"], "while mengulang selama kondisinya benar."),
        ],
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = LANGUAGES.flatMap((l) => l.lessons);

export function getLanguage(id: string): Language | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

/** Bahasa pemilik sebuah pelajaran. */
export function languageOfLesson(lessonId: string): Language | undefined {
  return LANGUAGES.find((l) => l.lessons.some((x) => x.id === lessonId));
}

/** Pelajaran terbuka bila pertama di bahasanya, atau pelajaran sebelumnya (di bahasa yang sama) sudah selesai. */
export function isLessonUnlocked(lessonId: string, completed: Record<string, unknown>): boolean {
  const lang = languageOfLesson(lessonId);
  if (!lang) return false;
  const i = lang.lessons.findIndex((x) => x.id === lessonId);
  return i === 0 || !!completed[lang.lessons[i - 1].id];
}
