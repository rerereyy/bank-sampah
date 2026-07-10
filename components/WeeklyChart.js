"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function WeeklyChart({ data }) {
  const formatted = (data || []).map((d) => ({
    hari: new Date(d.hari).toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }),
    berat: Number(d.berat),
  }));

  if (formatted.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-ink-soft">
        Belum ada data minggu ini.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ left: -20, right: 10 }}>
        <defs>
          <linearGradient id="fillBerat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4c7a50" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#4c7a50" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#b9ae8f" opacity={0.4} vertical={false} />
        <XAxis dataKey="hari" tick={{ fontSize: 11, fill: "#5c5240" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#5c5240" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#f6f1e2", border: "1px solid #b9ae8f", borderRadius: 8, fontSize: 12 }}
          formatter={(v) => [`${v} kg`, "Berat"]}
        />
        <Area type="monotone" dataKey="berat" stroke="#345a38" strokeWidth={2} fill="url(#fillBerat)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
