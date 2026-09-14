export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>데이터 파이프라인 대시보드</h1>
      <p>시스템 내부 API 서버가 정상 가동 중입니다.</p>
      <hr style={{ borderColor: "#1e293b", margin: "20px 0" }} />
      <div style={{ display: "flex", gap: "15px" }}>
        <a
          href="/api/products"
          target="_blank"
          style={{
            padding: "12px 24px",
            background: "#38bdf8",
            color: "#000",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          GET: 전체 상품 데이터 타격 테스트
        </a>
      </div>
      <p style={{ marginTop: "20px", color: "#94a3b8", fontSize: "14px" }}>
        ※ POST 요청 및 방어선 검증은 <b>Postman</b>을 사용하십시오.
      </p>
    </div>
  );
}
