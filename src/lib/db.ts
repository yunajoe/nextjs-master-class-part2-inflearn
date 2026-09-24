export interface Prompt {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export const db = {
  prompts: [
    {
      id: "1",
      title: "알고리즘 코치 프롬프트",
      content:
        "학생이 질문했을 때 즉시 정답을 주지 마라. 논리적 결함이 무엇인지 질문을 던져 스스로 깨우치게 하라.",
      updatedAt: new Date().toISOString(),
    },
  ],
};
