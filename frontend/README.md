# Visit Flow — Prototype Manajemen Kunjungan

Aplikasi web fullstack untuk membantu tim lapangan mencatat, memantau, dan memperbarui status rencana kunjungan ke berbagai entitas (`B2G` dan `B2B`), dilengkapi pencatatan **Nama Sales** dan proteksi autentikasi API.

## 1. Akun Demo & Keamanan Autentikasi
Aplikasi ini menerapkan autentikasi berbasis token (**Laravel Sanctum**) sehingga seluruh endpoint API (`/api/activities` dan `/api/entities`) terlindungi dan tidak dapat dimanipulasi langsung melalui URL tanpa token yang sah.

- **Email:** `sales@visitflow.id`
- **Password:** `password123`

## 2. Pemilihan Tech Stack & Library
1. **Backend — Laravel 11 & Laravel Sanctum:** Arsitektur MVC yang terstruktur, Eloquent ORM untuk filter multi-parameter yang aman, validasi request bawaan (`422 Unprocessable Entity`), serta Laravel Sanctum untuk autentikasi API token.
2. **Database — PostgreSQL:** Database relasional yang kuat untuk menjaga konsistensi tipe data, tanggal kunjungan, dan constraint keunikan entitas.
3. **Frontend — React.js (Vite), Axios, & Tailwind CSS:** Pengelolaan state UI reaktif dengan komponen terpisah untuk kombinasi filter, *loading state*, *error state*, dan *empty state*, serta Axios interceptor untuk token Bearer otomatis.

## 3. Cara Menjalankan Aplikasi

### Prasyarat
- PHP >= 8.2 & Composer (dengan ekstensi `pdo_pgsql` aktif)
- PostgreSQL
- Node.js >= 18 & NPM

### A. Menjalankan Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
Sesuaikan konfigurasi database di file `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=visit-flow
DB_USERNAME=postgres
DB_PASSWORD=password_anda
```
Lalu jalankan migrasi, seeder data fiktif, dan server API:
```bash
php artisan migrate --seed
php artisan serve
```
Backend akan berjalan di `http://127.0.0.1:8000`.

### B. Menjalankan Frontend (React.js)
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`. Buka URL tersebut dan masuk menggunakan akun demo di atas.

### C. Menjalankan Pengujian Otomatis (PHPUnit)
```bash
cd backend
php artisan test
```
Pengujian mencakup:
- Proteksi autentikasi endpoint (`401 Unauthorized` jika tanpa token).
- Kombinasi filter (`segment`, `status`, rentang tanggal inklusif `from` & `to`, serta `search`).
- Validasi input pembuatan rencana kunjungan dan pembaruan status (`VISITED` / `NOT_VISITED`).
- Mekanisme *fallback* daftar entitas dari riwayat kunjungan jika master data tidak tersedia.

## 4. Keputusan Teknis & Batasan yang Diketahui
- **Filter Berbasis Backend:** Seluruh filter (`segment`, `status`, rentang tanggal inklusif `from`/`to`, dan `search`) diproses melalui query database di backend, bukan sekadar menyembunyikan elemen di sisi tampilan.
- **Konsistensi Ringkasan:** Angka ringkasan (`Total`, `VISITED`, `NOT_VISITED`) dihitung dari dataset hasil filter yang sama agar selalu sinkron dengan tabel.
- **Anti-Duplikasi & Fallback Entitas:** `GET /api/entities` memprioritaskan master data dengan label pembeda jenis entitas (`displayLabel`), dan otomatis melakukan *fallback* ke riwayat kunjungan bila master data tidak menyediakan pilihan relevan.
- **Batasan Prototype:** Token disimpan di `localStorage` untuk kemudahan demo lokal (untuk lingkungan produksi disarankan menggunakan `HttpOnly Cookie`).

## 5. Keterangan Penggunaan AI
- **Persentase Penggunaan AI:** ~40% (digunakan sebagai asisten pembuatan kerangka awal controller, pemecahan komponen UI React + Tailwind CSS, dan penyusunan pengujian PHPUnit).
- **Fungsi yang Dibantu AI:**
  - `EntityController::index` (logika penyusunan *fallback* riwayat dan deduplikasi entitas).
  - `ActivityController::index` (penyusunan *query builder* multi-filter).
  - Komponen UI React (`ActivityTable.jsx`, `AddActivityModal.jsx`, `FilterBar.jsx`).
  - `VisitFlowTest.php` (kerangka pengujian fitur API).
'@ | Out-File -FilePath "README.md" -Encoding utf8