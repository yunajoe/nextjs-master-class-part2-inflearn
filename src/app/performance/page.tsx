async function getNextjsStats() {
  // 브라우저 표준 fetch API에 Next.js만의 특수 통제 객체인 'next' 속성을 주입합니다.
  const res = await fetch("https://api.github.com/repos/vercel/next.js", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("GitHub 데이터를 가져오는데 실패했습니다.");
  return res.json();
}

async function page() {
  // 첫 번째 호출: 시스템 메모리가 비어있으므로 실제 네트워크 통신이 발생합니다.
  const data1 = await getNextjsStats();

  // 두 번째 호출: 동일한 fetch 요청을 감지한 시스템이 네트워크 통신을 차단하고 메모리에서 값을 꺼냅니다.
  const data2 = await getNextjsStats();

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ color: "#f59e0b" }}>Request Memoization 통제 완료</h1>
      <hr style={{ borderColor: "#1e293b", margin: "20px 0" }} />
      <p>
        <strong>Repository:</strong> {data1.full_name}
      </p>
      <p>
        <strong>Stars:</strong> {data1.stargazers_count.toLocaleString()}
      </p>
      <p>
        <strong>isIdentical:</strong> {String(data1.id === data2.id)}
      </p>
    </main>
  );
}

export default page;
