async function page() {
  const url = "https://api.frankfurter.app/latest?from=USD&to=KRW,JPY,EUR";
  const res = await fetch(url, {
    next: { revalidate: 10 },
  });
  const data = await res.json();
  // 백그라운드 갱신(Revalidate)이 일어날 때마다 터미널에 이 로그가 찍히게 됩니다.
  const now = new Date().toLocaleTimeString();
  console.log(`🔄 [ISR 갱신] 환율 데이터 재검증 완료! 기준 시간: ${now}`);
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl border border-indigo-500/30 max-w-2xl w-full text-center">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">
          🌍 글로벌 환율 지표 (USD 기준)
        </h1>
        <p className="text-slate-400 mb-8 font-semibold">
          이 지표는 SWR 패턴에 의해 백그라운드에서 10초마다
          점진적(Incremental)으로 갱신됩니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* KRW (원화) */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-700">
            <p className="text-sm text-slate-500 font-bold mb-2">
              대한민국 (KRW)
            </p>
            <p className="text-3xl font-black text-indigo-400">
              ₩{data.rates.KRW.toLocaleString()}
            </p>
          </div>
          {/* JPY (엔화) */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-700">
            <p className="text-sm text-slate-500 font-bold mb-2">일본 (JPY)</p>
            <p className="text-3xl font-black text-emerald-400">
              ¥{data.rates.JPY.toLocaleString()}
            </p>
          </div>
          {/* EUR (유로화) */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-700">
            <p className="text-sm text-slate-500 font-bold mb-2">
              유럽연합 (EUR)
            </p>
            <p className="text-3xl font-black text-amber-400">
              €{data.rates.EUR.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="inline-block bg-slate-700/50 px-6 py-3 rounded-full border border-slate-600">
          <p className="text-xs text-slate-300 font-mono tracking-wide">
            ⏱️ 마지막 통계 연산 기준시: <br />
            <span className="text-indigo-300 font-bold">
              {data.date} (서버 캐싱: {now})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
