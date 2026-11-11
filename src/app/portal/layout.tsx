function PortalLayout({
  children,
  qa,
  notifications,
}: {
  children: React.ReactNode;
  qa: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <header className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          🦆 코라파덕 수강생 포털
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          병렬 라우트와 독립된 로딩 생태계를 통해 조립된 완벽한 뷰입니다.
        </p>
      </header>

      {/* Tailwind Grid를 활용하여 독립된 슬롯들을 하나의 도화지 위에 우아하게 배치합니다. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        <div className="col-span-1 lg:col-span-3">{notifications}</div>
        <div className="col-span-1 lg:col-span-6">{children}</div>
        <div className="col-span-1 lg:col-span-3">{qa}</div>
      </div>
    </div>
  );
}

export default PortalLayout;
