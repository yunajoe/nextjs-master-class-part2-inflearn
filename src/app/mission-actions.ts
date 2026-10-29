"use server";
import { revalidatePath } from "next/cache";

let mockSuggestions = [
  {
    id: "SUG_1",
    boardId: "hq",
    content: "서버 아키텍처 강의를 더 늘려주세요!",
    author: "열혈수강생",
  },
  {
    id: "SUG_2",
    boardId: "hq",
    content: "카지노 사이트 가입하세요!!! (악성 스팸)",
    author: "도박봇",
  },
];

export async function getSuggestions(boardId: string) {
  await new Promise((res) => setTimeout(res, 500));
  return mockSuggestions.filter((s) => s.boardId === boardId);
}

export const deleteAuthor = async (suggestionId: string, boardId: string) => {
  try {
    mockSuggestions = mockSuggestions.filter(
      (data) => data.id !== suggestionId,
    );
    console.log(`🗑️ [DB 갱신] 건의 ${suggestionId} 영구 삭제 완료`);
    revalidatePath(`/board/${boardId}`);
    console.log(`🔥 [캐시 파괴] /board/${boardId} 라우트 최신화 지시 완료`);
  } catch (error) {
    console.error("삭제 실패:", error);
  }
};
