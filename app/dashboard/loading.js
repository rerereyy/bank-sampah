export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-leaf-deep border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-ink-soft font-mono">Memuat data...</p>
      </div>
    </div>
  );
}
