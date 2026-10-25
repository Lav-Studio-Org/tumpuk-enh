# Design Critique: Tumpuk! (sebelum enhancement)

Konteks: game merge ala Suika untuk HP, target GitHub Pages dulu lalu Play Store. Kode adalah payload web dari APK (melonJS 20, editor Melon Runtime). Diaudit di 390x844 @2x (Chromium, WebGL2 lewat SwiftShader). Sudut pandang: senior level designer + product designer.

## Kesan pertama

Artnya kuat: ilustrasi kayu-dan-daun yang hangat, 7 dunia bertema Indonesia (Kebun, Pasar, Warung, Pantai, Hutan, Desa, Misteri) dengan 77 objek berwajah lucu. Fisika dan efek merge (sedotan, combo nada Do-Re-Mi) sudah terasa enak. Peluang terbesar ada di **struktur produk**: tidak ada tujuan jangka panjang, koin tidak bisa dipakai, power-up gratis tanpa batas sehingga game tidak bisa kalah, dan sebagian besar teks masih Bahasa Inggris.

## Usability

| Temuan | Tingkat | Rekomendasi |
|---|---|---|
| Renderer dipaksa `WEBGL` (WebGL2 saja). Di HP tanpa WebGL2 layar langsung hitam. | Kritis | `video.AUTO` supaya jatuh ke Canvas. |
| Power-up (Kipas, Palu, Bom) gratis dan tanpa batas. Pemain bisa terus menghapus buah, jadi Game Over tidak berarti. | Kritis | Stok per power-up, beli dengan koin, atau +1 lewat iklan berhadiah. Angka stok terlihat di tombol. |
| Koin didapat tiap ronde dan dari prestasi, tapi tidak ada yang bisa dibeli. | Kritis | Koin dipakai untuk power-up dan membuka dunia. |
| Semua 7 dunia terbuka sejak awal. Tidak ada "tujuan berikutnya". | Sedang | Dunia terbuka berurutan: capai skor target di dunia sebelumnya, atau buka dengan koin. Gembok + syarat di papan peta. |
| Tidak ada preview buah berikutnya (padahal data `nextObject` sudah ada dan mock desain `prev` menampilkannya). | Sedang | Bingkai "Berikutnya" di HUD. |
| Peta tidak punya tombol kembali ke menu. | Sedang | Tombol kembali di pojok kiri atas. |
| Pemain baru tidak diberi tahu cara main. | Sedang | Petunjuk sekali di game pertama: "Geser lalu lepas. Gabungkan yang sama!" |
| Saat buah melewati garis bahaya tidak ada hitungan mundur yang jelas. | Sedang | Peringatan "Awas!" + hitung mundur di atas toples. |
| Kalah langsung ke hasil, tanpa pilihan lanjut. | Sedang | "Hidupkan lagi" sekali per ronde lewat iklan berhadiah, membersihkan bagian atas toples. |
| Saat power-up aktif tidak ada cara membatalkan atau petunjuk apa yang harus diketuk. | Kecil | Label "Ketuk buah untuk dipukul" + tombol Batal. |
| Loading menunggu semua aset (52 MB, termasuk 7 BGM 256 kbps dan musik loading 2,5 menit). | Sedang | BGM dan musik loading di-stream, audio dikompres ke 96 kbps. |

## Hierarki visual

- **Yang pertama dilihat**: papan judul TUMPUK! di menu, buah yang tergantung di gameplay. Tepat.
- **Alur baca gameplay**: skor (atas tengah) lalu toples lalu bar evolusi bawah. Rekor kecil sekali di kiri atas dan sulit dibaca.
- **Penekanan**: layar hasil punya plakat judul kosong, tiga baris angka tanpa label, dan overlay gelap yang tidak menutup layar. Momen rekor baru tidak dirayakan. Tombol Ulangi dan Menu sama berat, tidak ada aksi utama.

## Konsistensi

| Elemen | Masalah | Rekomendasi |
|---|---|---|
| Bahasa | "Settings", "MUSIC", "SFX", 18 prestasi, "MULAI / JELAJAH", judul tab "melonJS Game" | Bahasa Indonesia sesuai glosarium playbook. |
| Panel Prestasi | Kartu gelap gaya dashboard, lain sendiri dibanding UI kayu. Tombol memakai huruf "X", "<", ">" sebagai ikon. | Panel kayu yang sama dengan Pengaturan dan Hasil, ikon dari sprite SVG. |
| Angka | Format `1,029` (en-US) | `1.029` (id-ID). |
| Warna tombol | Belum ada tombol iklan, belum ada aksi utama yang jelas. | Hijau + ikon video hanya untuk iklan berhadiah, oranye untuk aksi utama. |

## Aksesibilitas

- **Kontras**: teks hitam di plakat krem bagus. Teks rekor 10px di kiri atas terlalu kecil.
- **Target sentuh**: tombol kayu di HUD sekitar 44px, cukup. Tombol halaman prestasi kecil.
- **Label**: canvas tanpa label. UI DOM baru memakai `aria-label` dan `aria-live` untuk toast.
- **Gerak**: animasi UI baru menghormati `prefers-reduced-motion`.

## Yang sudah bagus

- Kualitas ilustrasi dan konsistensi gaya antar dunia.
- Merge terasa memuaskan: sedotan, pop, partikel, combo bernada naik.
- Garis bantu jatuh memakai raycast bentuk objek, akurat.
- Prestasi dan penyimpanan progres sudah ada.

## Prioritas

1. **Fondasi rilis**: fallback renderer, audio ringan dan bisa pulih, PWA, hapus plugin debug dan `console.log`.
2. **Ekonomi yang memberi arti**: power-up berstok, koin bisa dipakai, iklan berhadiah sebagai pilihan (lanjut main, 2x koin, +1 power-up).
3. **Tujuan jangka panjang**: dunia terbuka berurutan dengan syarat yang terlihat di peta.
4. **Layar hasil dan Hidupkan lagi** yang merayakan rekor dan punya satu aksi utama.
5. **Bahasa Indonesia penuh** dan panel Prestasi/Pengaturan yang seragam.
6. **Onboarding**: petunjuk game pertama, preview berikutnya, peringatan bahaya.
