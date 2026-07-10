"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 text-sm border border-rule rounded-full px-4 py-1.5 hover:bg-paper"
    >
      <Printer size={15} /> Cetak
    </button>
  );
}
