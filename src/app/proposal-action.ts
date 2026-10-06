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
    cookieStore.set("mode", changeMode);
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
      throw new Error("5자 이상 입력하세요!");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // db 작동
    const newData = {
      id: ProposalData.length + 1,
      title,
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
