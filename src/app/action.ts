"use server";

// 1. 데이터 규격화 (인터페이스)
interface NewProductData {
  title: string;
  price: number;
}

/**
 * [서버 액션 함수]
 * 프론트엔드 폼에서 직접 호출될 순수 백엔드 비즈니스 로직입니다.
 */
export async function createProductAction(formData: FormData) {
  // 1단계: 웹 표준 FormData 객체에서 데이터 안전 추출
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));

  // 2단계: 1차 유효성 방어선 (Validation)
  if (!title || price <= 0) {
    // API 에러 응답 대신, 순수 자바스크립트 에러를 던집니다.
    throw new Error("상품명과 올바른 가격을 입력해주세요.");
  }

  // 3단계: 가상의 DB 저장 로직 수행
  console.log(`💾 [DB 저장 완료] 상품명: ${title}, 가격: ${price}원`);

  // 4단계: 클라이언트로 반환할 결과 페이로드
  return {
    success: true,
    message: "시스템에 상품이 성공적으로 등록되었습니다.",
  };
}
export async function createDevice(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price")) as number;
  console.log("name ===>", name, "price ===>", price);
  if (!name || !price || price <= 0) {
    // API 에러 응답 대신, 순수 자바스크립트 에러를 던집니다.
    throw new Error("상품명과 올바른 가격을 입력해주세요.");
  }
  console.log(`💾 [DB 저장 완료] 디바이스명: ${name}, 가격: ${price}원`);
}

export interface ClearanceState {
  success: boolean;
  message: string;
  attemptCount: number; // 클라이언트의 useState 없이 서버가 추적할 '시도 횟수'
  clearanceCode?: string;
}

export async function issueClearanceAction(
  prevState: ClearanceState,
  formData: FormData,
) {
  const currentAttempt = prevState.attemptCount + 1;
  console.log(`[보안 감시] 발급 시도: ${currentAttempt}회차`);

  const empId = formData.get("empId") as string;
  const department = formData.get("department") as string;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!empId || empId.length < 4) {
    return {
      success: false,
      message: "사번은 최소 4자리 이상이어야 합니다.",
      attemptCount: currentAttempt,
    };
  }

  if (!department) {
    return {
      success: false,
      message: "부서를 정확히 입력해 주십시오.",
      attemptCount: currentAttempt,
    };
  }

  const generatedCode = `SEC-${Math.floor(1000 + Math.random() * 9000)}X`;
  console.log(
    `💾 [DB 기록] ${department} 소속 ${empId} 사번 발급 완료: ${generatedCode}`,
  );
  return {
    success: true,
    message: `정상적으로 발급되었습니다.`,
    attemptCount: currentAttempt,
    clearanceCode: generatedCode,
  };
}
