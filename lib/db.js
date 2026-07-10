import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

let client;

export function db() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:local.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

let initialized = false;

export function resetInitialized() {
  initialized = false;
}

export async function ensureSchema() {
  if (initialized) return;
  const c = db();

  await c.batch(
    [
      `CREATE TABLE IF NOT EXISTS warga (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        rt TEXT,
        alamat TEXT,
        no_hp TEXT,
        saldo INTEGER NOT NULL DEFAULT 0,
        total_poin INTEGER NOT NULL DEFAULT 0,
        total_berat REAL NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS jenis_sampah (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        satuan TEXT NOT NULL DEFAULT 'kg',
        harga_per_kg INTEGER NOT NULL,
        poin_per_kg INTEGER NOT NULL DEFAULT 1
      )`,
      `CREATE TABLE IF NOT EXISTS setoran (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warga_id INTEGER NOT NULL REFERENCES warga(id),
        jenis_sampah_id INTEGER NOT NULL REFERENCES jenis_sampah(id),
        berat_kg REAL NOT NULL,
        harga_per_kg INTEGER NOT NULL,
        poin_per_kg INTEGER NOT NULL DEFAULT 1,
        total_rupiah INTEGER NOT NULL,
        total_poin INTEGER NOT NULL,
        tanggal TEXT NOT NULL DEFAULT (datetime('now')),
        petugas TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS penarikan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warga_id INTEGER NOT NULL REFERENCES warga(id),
        jumlah INTEGER NOT NULL,
        keterangan TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        tanggal TEXT NOT NULL DEFAULT (datetime('now')),
        approved_at TEXT,
        petugas TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        nama TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'nasabah')),
        warga_id INTEGER REFERENCES warga(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ].map((sql) => ({ sql, args: [] }))
  );

  const userCount = await c.execute("SELECT COUNT(*) as n FROM users");
  if (Number(userCount.rows[0].n) === 0) {
    const hash = await bcrypt.hash("banksampah123", 10);
    await c.execute({
      sql: "INSERT INTO users (username, password_hash, nama, role) VALUES (?, ?, ?, ?)",
      args: ["admin", hash, "Petugas Bank Sampah", 'admin'],
    });
  }

  const jenisCount = await c.execute("SELECT COUNT(*) as n FROM jenis_sampah");
  if (Number(jenisCount.rows[0].n) === 0) {
    await c.batch(
      [
        ["Plastik Botol (PET)", "kg", 3000, 3],
        ["Plastik Kresek/Campur", "kg", 1000, 1],
        ["Kertas/Kardus", "kg", 2000, 2],
        ["Kaleng/Logam", "kg", 5000, 5],
        ["Kaca/Botol Beling", "kg", 1500, 1],
        ["Minyak Jelantah", "kg", 4000, 4],
      ].map(([nama, satuan, harga, poin]) => ({
        sql: "INSERT INTO jenis_sampah (nama, satuan, harga_per_kg, poin_per_kg) VALUES (?, ?, ?, ?)",
        args: [nama, satuan, harga, poin],
      }))
    );
  }

  initialized = true;
}
