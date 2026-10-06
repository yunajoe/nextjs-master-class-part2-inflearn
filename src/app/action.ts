"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export interface ProductFormState {
  success: boolean;
  message: string;
  attemptCount: number;
}

export async function makeProductAction(
  prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const currentAttempt = prevState.attemptCount + 1;
  console.log(
    `[시스템 감시] 폼 제출 시도: ${currentAttempt}회차 (직전 메시지: ${prevState.message || "없음"})`,
  );
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));

  if (!title || title.length < 2) {
    return {
      success: false,
      message: "상품명은 최소 2글자 이상 입력해야 합니다.",
      attemptCount: currentAttempt,
    };
  }
  if (price <= 0) {
    return {
      success: false,
      message: "가격은 0원보다 커야 합니다.",
      attemptCount: currentAttempt,
    };
  }
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log(`💾 [DB 저장 완료] 상품명: ${title}, 가격: ${price}원`);

  return {
    success: true,
    message: `성공적으로 등록되었습니다: ${title}`,
    attemptCount: currentAttempt,
  };
}

interface MentoringFormState {
  success: boolean;
  message: string;
  attemptCount: number;
}

// useActionState에 연결될 서버 함수는 반드시 첫 번째 인자로 prevState를 받습니다.
export async function createMentoring(
  pervState: MentoringFormState,
  formState: FormData,
): Promise<MentoringFormState> {
  const currentCount = pervState.attemptCount + 1;
  const name = formState.get("name") as string;
  const subject = formState.get("subject") as string;
  if (!name || !subject) {
    return {
      success: false,
      message: "필수 입력값이 누락되었습니다.",
      attemptCount: currentCount,
    };
  }

  // 3초 지연
  new Promise((resolve) => setTimeout(resolve, 3000));

  db.mentoringList.unshift({
    id: Date.now().toString(),
    name,
    subject,
    appliedAt: new Date().toISOString(),
  });
  console.log(`💾 [DB 저장 완료] ${name} 학생의 멘토링 신청 접수`);

  // 빌드 시점에 굳어져 버린 '/korapaduck' 경로의 정적 HTML 스냅샷을
  // 당장 쓰레기통에 처넣으라고 프레임워크에게 호통을 칩니다.
  revalidatePath("/korapaduck");
  // 내부적으로 NEXT_REDIRECT 에러를 발생시켜 브라우저를 강제 이동시킵니다.
  // 주의: 이 함수 아래에 작성된 코드는 에러 발생으로 인해 절대 실행되지 않습니다.
  redirect("/korapaduck");
}

export async function toggleProductLikeAction(
  productId: string,
  newLikeStatus: boolean,
) {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  if (Math.random() < 0) {
    throw new Error("서버 통신 중 알 수 없는 에러가 발생했습니다.");
  }

  // [단계 3] DB 업데이트 로직 (성공을 가정)
  // 실제 환경이라면 prisma.product.update() 등의 ORM 코드가 들어갈 자리입니다.
  console.log(
    `💾 [DB 업데이트 완료] 상품 ${productId}의 좋아요 상태: ${newLikeStatus}`,
  );
  // [단계 4] 데이터 동기화:
  // 데이터가 변경되었으므로 Next.js 라우터 캐시를 박살 내고 새로운 상태로 화면을 새로고침합니다.
  revalidatePath(`/products/${productId}`);

  return newLikeStatus;
}

export async function toggleThemeAction() {
  const cookieStore = await cookies();
  const currentTheme = cookieStore.get("theme")?.value || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  await new Promise((resolve) => setTimeout(resolve, 1000));

  cookieStore.set("theme", newTheme, {
    httpOnly: true, // XSS 공격 원천 차단
    secure: process.env.NODE_ENV === "production", // 실서버 HTTPS 강제
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1년 유지
  });
  console.log(
    `🌙 [테마 변경] 서버가 사용자의 테마를 '${newTheme}'로 기억합니다.`,
  );
  revalidatePath("/", "layout");
}

export async function changeSettingAction() {
  const cookiesStore = await cookies();
  const concentrateMode = cookiesStore.get("settings")?.value || "free";
  const newMode = concentrateMode === "concentrate" ? "free" : "concentrate";
  await new Promise((resolve) => setTimeout(resolve, 1000));
  cookiesStore.set("settings", newMode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // production을 일때는 https
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1년 유지
  });

  console.log(` [설정 변경] 서버가 사용자의 설정을 '${newMode}'로 기억합니다.`);
  revalidatePath("/", "layout");
}

/**
 * [방어적 서버 액션]
 * redirect가 던지는 NEXT_REDIRECT 에러를 catch 블록이 삼키지 않도록 설계되었습니다.
 */

/**
 *
 * @param formData
 */

/**
 * redirect 처리 
 * Server Action
    │
    ├─ redirect("/posts")
    │
    ├─ NEXT_REDIRECT throw
    │
    ├─ catch가 잡음
    │
    ├─ throw error
    │
    ▼
Next.js Server Action 처리 계층
    │
    ├─ "아, 이건 일반적인 에러가 아니구나"
    │
    ├─ redirect 신호 확인
    │
 */
export async function safeCreatePostAction(formData: FormData) {
  try {
    const title = formData.get("title");
    if (!title) throw new Error("제목 필수");
    console.log(`💾 [DB 저장 완료] 제목: ${title}`);
    const cookieStore = await cookies();
    cookieStore.set("author_badge", "true", { httpOnly: true, secure: true });

    redirect("/posts"); //  Error: NEXT_REDIRECT
  } catch (error) {
    // 방법1
    // if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    //   throw error
    // }
    // 방법2
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("서버 처리 중 오류:", error);
  }
}
export async function safeCreatePostAction2(formData: FormData) {
  let isSuccess = false;
  try {
    const title = formData.get("title");
    if (!title) throw new Error("제목 필수");
    console.log(`💾 [DB 저장 완료] 제목: ${title}`);
    const cookieStore = await cookies();
    cookieStore.set("author_badge", "true", { httpOnly: true, secure: true });
    isSuccess = true;
  } catch (error) {
    console.error("서버 처리 중 오류:", error);
  }
  if (isSuccess) {
    redirect("/posts");
  }
}

export async function adminLogin(formData: FormData) {
  let isSuccess = false;
  try {
    const code = formData.get("code");
    if (code !== "2026") {
      throw new Error("[System Error] 인가 코드 불일치!");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    isSuccess = true;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // front에서 처리할 수 있겠끔..
    }
    console.error("서버 처리 중 오류", error);
  }

  if (isSuccess) {
    redirect("/admin/dashboard");
  }
}

export interface AuthState {
  success: boolean;
  message: string;
}

export async function authenticateAdminAction(
  prevState: AuthState,
  formData: FormData,
) {
  const code = formData.get("code") as string;
  let isSuccess = false;
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (!code) {
      throw new Error("인가 코드가 비어있습니다.");
    }
    if (code !== "2026") {
      throw new Error("유효하지 않은 인가 코드입니다. 보안팀에 기록됩니다.");
    }

    console.log(`🔐 [보안 통과] 관리자 인가 성공`);
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    isSuccess = true;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("서버 인가 처리 중 에러:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "서버 오류",
    };
  }
  if (isSuccess) {
    redirect("/admin/dashboard");
  }

  return { success: true, message: "성공!" };
}
