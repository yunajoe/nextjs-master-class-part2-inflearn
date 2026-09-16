async function getData() {
  const result = await fetch("https://api.github.com/repos/vercel/next.js", {
    next: { revalidate: 3600 },
  });
  if (!result.ok) {
    throw new Error("GitHub 데이터를 가져오는데 실패했습니다.");
  }

  return result.json();
}

async function page() {
  const jsonData = await getData();
  const jsonData2 = await getData();
  return (
    <div>
      <h1>1차 호출:{jsonData.Stars}</h1>
      <h1>2차 호출:{jsonData2.Stars}</h1>
    </div>
  );
}

export default page;

// [화면 렌더링 - /performance 접속]
// 👇 (단 1번의 실제 통신으로 2개의 데이터블록 렌더링)
// 1차 호출: 123,456 Stars
// 2차 호출: 123,456 Stars
// ✅ 메모리 캐시 작동 성공 (식별자 일치)
