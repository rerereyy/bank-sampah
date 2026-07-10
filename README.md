# Bank Sampah Digital

Sistem digital "buku tabungan sampah" — mencatat setoran sampah terpilah warga,
mengonversinya otomatis jadi saldo & poin, mendukung penarikan saldo, dan
menampilkan peringkat nasabah paling rajin.

Dibuat untuk memenuhi tugas UAS Pemrograman Web (studi kasus SaaS nyata).

## Stack

- **Next.js 16 (App Router, JavaScript)** — full-stack, Server Actions
- **Tailwind CSS v4** — styling bertema buku tabungan (sampul hijau tua, kertas
  bergaris, angka gaya mesin ketik)
- **libSQL / Turso** — database, siap untuk production
- **jose** — session login (JWT via cookie httpOnly)
- **bcryptjs** — hash password admin

## Fitur

- Landing page publik bertema "sampul buku tabungan"
- Login petugas (session cookie, rute `/dashboard/*` terproteksi middleware)
- CRUD data nasabah (warga)
- CRUD master jenis sampah & harga per kg
- Catat setoran sampah → otomatis hitung saldo & poin, tampilkan bukti
  setoran bergaya struk buku tabungan (bisa dicetak)
- Penarikan saldo nasabah
- Peringkat (leaderboard) nasabah paling rajin setor
- Dashboard ringkasan dengan grafik setoran mingguan

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Tanpa env var apa pun, aplikasi otomatis memakai file SQLite lokal
(`local.db`) dan akun admin demo:

- **Username:** `admin`
- **Password:** `banksampah123`

## Setup database production (Turso)

1. Install Turso CLI, lalu login:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   turso auth login
   ```
2. Buat database:
   ```bash
   turso db create bank-sampah
   turso db show bank-sampah --url
   turso db tokens create bank-sampah
   ```
3. Catat `URL` dan `token` yang dihasilkan — dipakai sebagai environment
   variable `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN`.

## Deploy ke Vercel

1. Push project ini ke GitHub (pakai GitHub Desktop atau `git`).
2. Import repo di [vercel.com/new](https://vercel.com/new).
3. Di **Project Settings → Environment Variables**, tambahkan:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `SESSION_SECRET` (string acak bebas, minimal 32 karakter)
4. Deploy. Skema tabel & data awal (jenis sampah default + 4 nasabah contoh)
   otomatis dibuat saat request pertama ke server (lihat `lib/db.js`).
5. Setelah live, langsung ganti password admin demo lewat database
   (atau tambahkan halaman ubah password jika ingin, saat ini admin memakai
   satu akun bawaan `admin` / `banksampah123`).

## Struktur proyek

```
app/
  page.js                     landing page publik
  login/page.js                login petugas
  dashboard/layout.js          sidebar + proteksi
  dashboard/page.js            ringkasan & grafik
  dashboard/nasabah/           CRUD warga
  dashboard/jenis-sampah/      CRUD jenis & harga sampah
  dashboard/setoran/           catat setoran + bukti setoran (cetak)
  dashboard/penarikan/         tarik saldo
  dashboard/leaderboard/       peringkat nasabah
lib/
  db.js         koneksi Turso/libSQL + skema + seed data
  auth.js       session JWT via cookie
  actions.js    semua Server Actions (login, CRUD, transaksi)
  queries.js    query read-only untuk setiap halaman
middleware.js   proteksi rute /dashboard
```
