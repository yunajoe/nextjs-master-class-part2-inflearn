// 1. 순수 백엔드 함수를 브라우저 컴포넌트로 직접 Import

import { createProductAction } from "@/app/action";

export default function NewProductPage() {
  return (
    <div
      style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "400px" }}
    >
      <h1 style={{ color: "#0070f3" }}>새로운 상품 통제소</h1>
      <p style={{ color: "#666" }}>
        API 통신 코드가 완전히 증발한 혁신적인 폼 렌더링
      </p>
      <hr style={{ borderColor: "#eaeaea", margin: "20px 0" }} />

      {/* 2. <form>의 action 속성에 서버 함수를 직접 바인딩 */}
      <form
        action={createProductAction}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* name 속성이 백엔드의 formData.get("키") 와 정확히 일치해야 합니다. */}
        <input
          type="text"
          name="title"
          placeholder="상품명을 입력하세요"
          required
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            color: "black",
          }}
        />

        <input
          type="number"
          name="price"
          placeholder="가격을 입력하세요"
          required
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "14px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          상품 등록 시스템 가동
        </button>
      </form>
    </div>
  );
}
