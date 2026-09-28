export interface MentoringRequest {
  id: string;
  name: string;
  subject: string;
  appliedAt: string;
}

export const db = {
  mentoringList: [
    {
      id: "1",
      name: "김코딩",
      subject: "파이썬 기초 문법과 반복문 원리 이해",
      appliedAt: new Date().toISOString(),
    },
  ] as MentoringRequest[],
};
