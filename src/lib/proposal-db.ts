export type ProposalDataType = {
  id: number;
  title: string;
  likeCount: number;
};

export let ProposalData: ProposalDataType[] = [
  {
    id: 1,
    title: "2026 제안서 1",
    likeCount: 0,
  },
];

export interface Proposal {
  id: string;
  title: string;
  votes: number;
}

const globalForDb = globalThis as unknown as {
  __db: { proposals: Proposal[] };
};

if (!globalForDb.__db) {
  globalForDb.__db = {
    proposals: [
      {
        id: "PROP_1",
        title: "Next.js 15 기반 새로운 우리동네코딩 LMS 구축 제안",
        votes: 42,
      },
    ],
  };
}
export const db = globalForDb.__db;
