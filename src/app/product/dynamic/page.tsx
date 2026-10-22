/**
 *
 * 1. no-store:데이터를 메모리나 디스크 등 어디에도 캐시로 저장하지 말라는 뜻
 * 매 요청마다 무조건 원본 서버에 직접 요청을 보내고, 응답받은 데이터를 캐시에 기록하지도 않습니다
 *
 *
 * 2. no-cache (재검증 후 사용)
 *  캐시를 저장(사용)하되, 쓰기 전에 반드시 서버에 "데이터가 바뀌었니?"라고 검증(Revalidation)을 거치라는 뜻입니다.
 *  동작: 브라우저나 캐시 서버에 로컬 복사본을 저장해 둡니다. 단, 요청이 들어오면 서버에 조건부 요청(ETag나 Last-Modified 등 활용)을 보내서 데이터 변경 여부를 확인합니다.
 *  서버가 "변동 없다"고 응답하면(304 Not Modified) 다운로드 없이 기존 캐시를 재사용하고, 변경되었다면 새 데이터를 받아옵니다. 네트워크 대역폭을 조금이라도 아끼고 싶을 때 유용
 */

async function page() {
  const res = await fetch(
    "https://timeapi.io/api/Time/current/zone?timeZone=Asia/Seoul",
    {
      cache: "no-store",
    },
  );
  const jsonData = await res.json();
  return (
    <div className="p-10 max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-red-200">
      <div className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full w-max mb-4 text-sm">
        🔥 Dynamic Rendering (100% 신선도 유지)
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-4">
        실시간 상품 상세
      </h1>
      <p className="text-gray-600 mb-4">
        프레임워크의 빌드 룰을 깨부수고 매 요청마다 서버 API를 타격합니다.
      </p>

      <div className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg text-lg">
        서버 렌더링 시간:
        <br />
        <span className="text-white">{jsonData.dateTime}</span>
      </div>
    </div>
  );
}

export default page;
