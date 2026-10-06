"use server";
import { ProposalData } from "@/lib/proposal-db";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function proposalDarkModeActions() {
  try {
    const cookieStore = await cookies();
    const currentMode = cookieStore.get("mode")?.value ?? "light";
    const changeMode = currentMode === "dark" ? "light" : "dark";
    cookieStore.set({
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      name: "mode",
      value: changeMode,
    });
  } catch (error) {
    console.error("테마 변경 에러가 났습니다.");
  }
}

export type FormResult = {
  success: boolean;
  message: string;
};

export async function proposalActions(
  prevState: FormResult,
  formData: FormData,
): Promise<FormResult> {
  try {
    const title = formData.get("title") as string;
    if (!title || title?.trim().length < 5) {
      throw new Error("5자 이상 입력해주세요.");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // db 작동
    const newData = {
      id: ProposalData.length + 1,
      title,
      likeCount: 0,
    };
    ProposalData.push(newData);
    redirect("/proposal");
  } catch (error) {
    console.error("FORMDATA 에러", error);
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: error instanceof Error ? error.message : "서버 오류",
    };
  }
}

export async function proposalLikeActions(id: number) {
  try {
    const itemIdx = ProposalData.findIndex((item) => item.id === id);
    if (itemIdx === -1) {
      throw new Error("아이템을 찾을 수 없습니다.");
    }
    const item = ProposalData.find((item) => item.id === id);
    if (!item) {
      throw new Error("아이템을 찾을 수 없습니다.");
    }

    const failurePercent = Math.random() <= 0.5;
    if (failurePercent) {
      throw new Error("좋아요 상태를 바꾸는데 실패하였습니다.");
    }
    const updatedItem = {
      ...item,
      likeCount: item?.likeCount + 1,
    };
    ProposalData.splice(itemIdx, 1, updatedItem);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "서버에러",
    };
  }
}
