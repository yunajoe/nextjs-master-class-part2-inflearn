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

export async function createSecurity(
  prevState: { count: number; success: boolean; message: string },
  formdata: FormData,
) {
  const id = formdata.get("employee-id") as string;
  const department = formdata.get("department") as string;
  if (!id || !department) {
    return {
      count: prevState.count,
      success: false,
      message: "필수값이 누락이 되었습니다.",
    };
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (id.length < 4) {
    return {
      count: prevState.count,
      success: false,
      message: "사원번호는 4자리 이상이어야 합니다.",
    };
  }

  return {
    count: prevState.count + 1,
    success: true,
    message: "발급 성공하였습니다.",
  };
}
