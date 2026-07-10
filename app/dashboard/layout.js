import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Recycle,
  ClipboardList,
  Wallet,
  Trophy,
  LogOut,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { logout } from "@/lib/actions";

const nav = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/dashboard/setoran", label: "Setor Sampah", icon: Recycle },
  { href: "/dashboard/nasabah", label: "Nasabah", icon: Users },
  { href: "/dashboard/jenis-sampah", label: "Jenis Sampah", icon: ClipboardList },
  { href: "/dashboard/penarikan", label: "Penarikan Saldo", icon: Wallet },
  { href: "/dashboard/leaderboard", label: "Peringkat Warga", icon: Trophy },
];

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-paper">
      <aside className="md:w-64 shrink-0 bg-cover text-paper-soft flex md:flex-col md:min-h-screen">
        <div className="px-6 py-6 border-b border-gold/15 hidden md:block">
          <div className="font-display italic text-gold-soft text-lg">
            Bank Sampah Digital
          </div>
          <div className="text-xs text-paper-soft/50 font-mono mt-1">
            {session?.nama}
          </div>
        </div>

        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible flex-1 px-2 md:px-3 py-3 md:py-4 gap-1 text-sm">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 whitespace-nowrap transition-colors"
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>

        <form action={logout} className="px-3 pb-4 hidden md:block">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm w-full text-paper-soft/70">
            <LogOut size={17} strokeWidth={1.8} />
            Keluar
          </button>
        </form>
      </aside>

      <main className="flex-1 px-6 md:px-10 py-8 md:py-10 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
