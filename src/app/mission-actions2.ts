"use server";

import { revalidateTag, updateTag } from "next/cache";

let mockEvaluations = [
  {
    id: "1",
    content: "디자인이 정말 아름답네요. 문제 해결의 정수가 담겨있습니다.",
    author: "Stella",
  },
  {
    id: "2",
    content: "강의가 너무 지루해요! 당장 환불해주세요!!! (악성 리뷰)",
    author: "Oliver",
  },
  { id: "3", content: "배송도 빠르고 기술력이 돋보입니다.", author: "Chloe" },
  { id: "4", content: "최고의 사용자 경험입니다.", author: "Noah" },
];

// evaluations을 가져오는 함수
export const fetchEvaluations = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return mockEvaluations;
};

// soft 삭제
export const deleteSoftEvaluation = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  mockEvaluations = mockEvaluations.filter((item) => item.id != id);
  revalidateTag("evaluations", "max");
};

// instant 삭제
export const deleteInstantEvaluation = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  mockEvaluations = mockEvaluations.filter((item) => item.id != id);
  updateTag("evaluations");
};
