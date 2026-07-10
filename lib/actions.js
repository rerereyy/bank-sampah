"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, ensureSchema } from "./db";
import { createSession, destroySession, getSession } from "./auth";

async function requireAuth(requiredRole = null) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (requiredRole && session.role !== requiredRole) {
    redirect("/dashboard");
  }
  return session;
}

export async function login(prevState, formData) {
  await ensureSchema();
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { error: "Username dan kata sandi wajib diisi." };
  }

  const c = db();
  const result = await c.execute({
    sql: "SELECT * FROM users WHERE username = ?",
    args: [username],
  });

  const user = result.rows[0];
  if (!user) return { error: "Username atau kata sandi salah." };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { error: "Username atau kata sandi salah." };

  await createSession({
    id: user.id,
    username: user.username,
    nama: user.nama,
    role: user.role,
    warga_id: user.warga_id,
  });

  // Redirect based on role
  if (user.role === 'admin') {
    redirect("/dashboard");
  } else {
    redirect("/dashboard/nasabah");
  }
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function registerNasabah(prevState, formData) {
  await ensureSchema();
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();
  const nama = formData.get("nama")?.toString().trim();
  const no_hp = formData.get("no_hp")?.toString().trim();

  if (!username || !password || !nama) {
    return { error: "Username, password, dan nama wajib diisi." };
  }

  const c = db();
  
  // Check if username exists
  const existing = await c.execute({
    sql: "SELECT id FROM users WHERE username = ?",
    args: [username],
  });
  if (existing.rows.length > 0) {
    return { error: "Username sudah digunakan." };
  }

  // Create warga entry
  const wargaResult = await c.execute({
    sql: "INSERT INTO warga (nama, no_hp) VALUES (?, ?) RETURNING id",
    args: [nama, no_hp || null],
  });
  const wargaId = wargaResult.rows[0].id;

  // Create user
  const hash = await bcrypt.hash(password, 10);
  await c.execute({
    sql: "INSERT INTO users (username, password_hash, nama, role, warga_id) VALUES (?, ?, ?, ?, ?)",
    args: [username, hash, nama, 'nasabah', wargaId],
  });

  return { success: "Registrasi berhasil! Silakan login." };
}

// ---------- WARGA ----------

export async function tambahWarga(prevState, formData) {
  await requireAuth('admin');
  await ensureSchema();
  const nama = formData.get("nama")?.toString().trim();
  const rt = formData.get("rt")?.toString().trim();
  const alamat = formData.get("alamat")?.toString().trim();
  const no_hp = formData.get("no_hp")?.toString().trim();

  if (!nama) return { error: "Nama wajib diisi." };

  await db().execute({
    sql: "INSERT INTO warga (nama, rt, alamat, no_hp) VALUES (?, ?, ?, ?)",
    args: [nama, rt || null, alamat || null, no_hp || null],
  });

  revalidatePath("/dashboard/nasabah");
  return { success: "Nasabah baru ditambahkan." };
}

export async function editWarga(prevState, formData) {
  await requireAuth('admin');
  await ensureSchema();
  const id = Number(formData.get("id"));
  const nama = formData.get("nama")?.toString().trim();
  const rt = formData.get("rt")?.toString().trim();
  const alamat = formData.get("alamat")?.toString().trim();
  const no_hp = formData.get("no_hp")?.toString().trim();

  if (!id || !nama) return { error: "Nama wajib diisi." };

  await db().execute({
    sql: "UPDATE warga SET nama = ?, rt = ?, alamat = ?, no_hp = ? WHERE id = ?",
    args: [nama, rt || null, alamat || null, no_hp || null, id],
  });

  revalidatePath("/dashboard/nasabah");
  return { success: "Data nasabah diperbarui." };
}

export async function hapusWarga(id) {
  await requireAuth('admin');
  await db().execute({ sql: "DELETE FROM setoran WHERE warga_id = ?", args: [id] });
  await db().execute({ sql: "DELETE FROM penarikan WHERE warga_id = ?", args: [id] });
  await db().execute({ sql: "DELETE FROM warga WHERE id = ?", args: [id] });
  revalidatePath("/dashboard/nasabah");
}

// ---------- JENIS SAMPAH ----------

export async function tambahJenisSampah(prevState, formData) {
  await requireAuth('admin');
  await ensureSchema();
  const nama = formData.get("nama")?.toString().trim();
  const satuan = formData.get("satuan")?.toString().trim() || "kg";
  const harga_per_kg = Number(formData.get("harga_per_kg"));
  const poin_per_kg = Number(formData.get("poin_per_kg")) || 1;

  if (!nama || !harga_per_kg) return { error: "Nama dan harga wajib diisi." };

  await db().execute({
    sql: "INSERT INTO jenis_sampah (nama, satuan, harga_per_kg, poin_per_kg) VALUES (?, ?, ?, ?)",
    args: [nama, satuan, harga_per_kg, poin_per_kg],
  });

  revalidatePath("/dashboard/jenis-sampah");
  return { success: "Jenis sampah ditambahkan." };
}

export async function editJenisSampah(prevState, formData) {
  await requireAuth('admin');
  await ensureSchema();
  const id = Number(formData.get("id"));
  const nama = formData.get("nama")?.toString().trim();
  const satuan = formData.get("satuan")?.toString().trim() || "kg";
  const harga_per_kg = Number(formData.get("harga_per_kg"));
  const poin_per_kg = Number(formData.get("poin_per_kg")) || 1;

  if (!id || !nama || !harga_per_kg) return { error: "Nama dan harga wajib diisi." };

  await db().execute({
    sql: "UPDATE jenis_sampah SET nama = ?, satuan = ?, harga_per_kg = ?, poin_per_kg = ? WHERE id = ?",
    args: [nama, satuan, harga_per_kg, poin_per_kg, id],
  });

  revalidatePath("/dashboard/jenis-sampah");
  return { success: "Jenis sampah diperbarui." };
}

export async function hapusJenisSampah(id) {
  await requireAuth('admin');
  await db().execute({ sql: "DELETE FROM jenis_sampah WHERE id = ?", args: [id] });
  revalidatePath("/dashboard/jenis-sampah");
}

// ---------- SETORAN ----------

export async function tambahSetoran(prevState, formData) {
  const session = await requireAuth('admin');
  await ensureSchema();

  const warga_id = Number(formData.get("warga_id"));
  const jenis_sampah_id = Number(formData.get("jenis_sampah_id"));
  const berat_kg = Number(formData.get("berat_kg"));

  if (!warga_id || !jenis_sampah_id || !berat_kg || berat_kg <= 0) {
    return { error: "Lengkapi nasabah, jenis sampah, dan berat yang valid." };
  }

  const c = db();
  const jenisResult = await c.execute({
    sql: "SELECT * FROM jenis_sampah WHERE id = ?",
    args: [jenis_sampah_id],
  });
  const jenis = jenisResult.rows[0];
  if (!jenis) return { error: "Jenis sampah tidak ditemukan." };

  const total_rupiah = Math.round(berat_kg * Number(jenis.harga_per_kg));
  const total_poin = Math.round(berat_kg * Number(jenis.poin_per_kg));

  const insertResult = await c.execute({
    sql: `INSERT INTO setoran (warga_id, jenis_sampah_id, berat_kg, harga_per_kg, poin_per_kg, total_rupiah, total_poin, petugas)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      warga_id,
      jenis_sampah_id,
      berat_kg,
      jenis.harga_per_kg,
      jenis.poin_per_kg,
      total_rupiah,
      total_poin,
      session.nama,
    ],
  });

  await c.execute({
    sql: `UPDATE warga SET saldo = saldo + ?, total_poin = total_poin + ?, total_berat = total_berat + ? WHERE id = ?`,
    args: [total_rupiah, total_poin, berat_kg, warga_id],
  });

  revalidatePath("/dashboard/setoran");
  revalidatePath("/dashboard/nasabah");
  revalidatePath("/dashboard");
  return { success: "Setoran dicatat.", setoranId: Number(insertResult.lastInsertRowid) };
}

// ---------- PENARIKAN ----------

export async function requestPenarikan(prevState, formData) {
  const session = await requireAuth('nasabah');
  await ensureSchema();

  const jumlah = Number(formData.get("jumlah"));
  const keterangan = formData.get("keterangan")?.toString().trim();

  if (!jumlah || jumlah <= 0) {
    return { error: "Jumlah penarikan harus lebih dari 0." };
  }

  const c = db();
  const wargaResult = await c.execute({ sql: "SELECT * FROM warga WHERE id = ?", args: [session.warga_id] });
  const warga = wargaResult.rows[0];
  if (!warga) return { error: "Data nasabah tidak ditemukan." };
  if (Number(warga.saldo) < jumlah) return { error: "Saldo tidak cukup." };

  // Create pending request and deduct saldo (reserved)
  await c.execute({
    sql: "INSERT INTO penarikan (warga_id, jumlah, keterangan, status) VALUES (?, ?, ?, 'pending')",
    args: [session.warga_id, jumlah, keterangan || null],
  });

  await c.execute({
    sql: "UPDATE warga SET saldo = saldo - ? WHERE id = ?",
    args: [jumlah, session.warga_id],
  });

  revalidatePath("/dashboard/riwayat");
  revalidatePath("/dashboard/nasabah");
  return { success: "Permintaan penarikan dikirim. Saldo sementara dikurangi." };
}

export async function konfirmasiPenarikan(formData) {
  const session = await requireAuth('admin');
  await ensureSchema();

  const id = Number(formData.get("id"));
  const status = formData.get("status")?.toString();

  if (!id || !['approved', 'rejected'].includes(status)) {
    return { error: "Data tidak valid." };
  }

  const c = db();
  const penarikanResult = await c.execute({ sql: "SELECT * FROM penarikan WHERE id = ?", args: [id] });
  const penarikan = penarikanResult.rows[0];
  if (!penarikan) return { error: "Data penarikan tidak ditemukan." };
  if (penarikan.status !== 'pending') return { error: "Penarikan sudah diproses." };

  await c.execute({
    sql: "UPDATE penarikan SET status = ?, petugas = ?, approved_at = datetime('now') WHERE id = ?",
    args: [status, session.nama, id],
  });

  // If rejected, restore saldo (it was deducted when request was made)
  if (status === 'rejected') {
    await c.execute({
      sql: "UPDATE warga SET saldo = saldo + ? WHERE id = ?",
      args: [penarikan.jumlah, penarikan.warga_id],
    });
  }

  revalidatePath("/dashboard/penarikan");
  revalidatePath("/dashboard/nasabah");
  revalidatePath("/dashboard");
  return { success: `Penarikan ${status === 'approved' ? 'disetujui' : 'ditolak'}.` };
}

export async function tambahPenarikan(prevState, formData) {
  const session = await requireAuth('admin');
  await ensureSchema();

  const warga_id = Number(formData.get("warga_id"));
  const jumlah = Number(formData.get("jumlah"));
  const keterangan = formData.get("keterangan")?.toString().trim();

  if (!warga_id || !jumlah || jumlah <= 0) {
    return { error: "Lengkapi nasabah dan jumlah penarikan yang valid." };
  }

  const c = db();
  const wargaResult = await c.execute({ sql: "SELECT * FROM warga WHERE id = ?", args: [warga_id] });
  const warga = wargaResult.rows[0];
  if (!warga) return { error: "Nasabah tidak ditemukan." };
  if (Number(warga.saldo) < jumlah) return { error: "Saldo nasabah tidak cukup." };

  await c.execute({
    sql: "INSERT INTO penarikan (warga_id, jumlah, keterangan, status, petugas, approved_at) VALUES (?, ?, ?, 'approved', ?, datetime('now'))",
    args: [warga_id, jumlah, keterangan || null, session.nama],
  });

  await c.execute({
    sql: "UPDATE warga SET saldo = saldo - ? WHERE id = ?",
    args: [jumlah, warga_id],
  });

  revalidatePath("/dashboard/penarikan");
  revalidatePath("/dashboard/nasabah");
  revalidatePath("/dashboard");
  return { success: "Penarikan saldo dicatat." };
}
