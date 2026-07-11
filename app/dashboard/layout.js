import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Recycle,
  ClipboardList,
  Wallet,
  Trophy,
  LogOut,
  History,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { logout } from "@/lib/actions";

const adminNav = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/dashboard/setoran", label: "Setor Sampah", icon: Recycle },
  { href: "/dashboard/nasabah", label: "Nasabah", icon: Users },
  { href: "/dashboard/jenis-sampah", label: "Jenis Sampah", icon: ClipboardList },
  { href: "/dashboard/penarikan", label: "Penarikan", icon: Wallet },
  { href: "/dashboard/leaderboard", label: "Peringkat", icon: Trophy },
];

const nasabahNav = [
  { href: "/dashboard/nasabah", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/dashboard/riwayat", label: "Riwayat", icon: History },
  { href: "/dashboard/penarikan-saya", label: "Tarik Saldo", icon: Wallet },
  { href: "/dashboard/leaderboard", label: "Peringkat", icon: Trophy },
];

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  const nav = session?.role === "admin" ? adminNav : nasabahNav;

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-paper min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 shrink-0 bg-cover text-paper-soft flex-col md:min-h-screen">
        <div className="px-6 py-6 border-b border-gold/15">
          <div className="font-display italic text-gold-soft text-lg">
            Bank Sampah Digital
          </div>
          <div className="text-xs text-paper-soft/50 font-mono mt-1">
            {session?.nama}
          </div>
          <div className="text-xs text-gold-soft/70 font-mono mt-0.5">
            {session?.role === "admin" ? "Petugas" : "Nasabah"}
          </div>
        </div>

        <nav className="flex flex-col flex-1 px-3 py-4 gap-1 text-sm">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>

        <form action={logout} className="px-3 pb-4">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm w-full text-paper-soft/70">
            <LogOut size={17} strokeWidth={1.8} />
            Keluar
          </button>
        </form>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden shrink-0 bg-cover text-paper-soft sticky top-0 z-30">
          <div className="px-4 pt-3 pb-2 border-b border-gold/15">
            <div className="flex items-center justify-between">
              <div className="font-display italic text-gold-soft text-sm">
                Bank Sampah Digital
              </div>
              <form action={logout}>
                <button className="text-xs text-paper-soft/60 hover:text-paper-soft">
                  Keluar
                </button>
              </form>
            </div>
          </div>
          <nav className="flex overflow-x-auto px-3 py-2 gap-1 text-sm scrollbar-hide">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 whitespace-nowrap transition-colors shrink-0"
              >
                <Icon size={15} strokeWidth={1.8} />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="flex-1 px-4 sm:px-6 md:px-10 py-4 md:py-10 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
