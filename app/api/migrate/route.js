import { NextResponse } from "next/server";
import { db, ensureSchema, resetInitialized } from "@/lib/db";

export async function GET() {
  try {
    resetInitialized();
    await ensureSchema();
    return NextResponse.json({ success: true, message: "Database migrated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const c = db();
    
    // Drop all tables one by one
    await c.execute("DROP TABLE IF EXISTS penarikan");
    await c.execute("DROP TABLE IF EXISTS setoran");
    await c.execute("DROP TABLE IF EXISTS jenis_sampah");
    await c.execute("DROP TABLE IF EXISTS users");
    await c.execute("DROP TABLE IF EXISTS warga");
    await c.execute("DROP TABLE IF EXISTS admin");
    
    // Re-create schema fresh
    resetInitialized();
    await ensureSchema();
    
    return NextResponse.json({ success: true, message: "Database cleaned and re-migrated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
