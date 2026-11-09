import React from "react";

// 아키텍트의 조립 공장: 골뱅이(@)로 만든 폴더들이 Props로 전달됩니다.
export default function DashboardLayout({
  children, // 기본 page.tsx의 내용
  analytics, // @analytics 폴더의 내용
  team, // @team 폴더의 내용
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        최고 관리자 대시보드
      </h1>

      <div className="grid grid-cols-12 gap-6">
        {/* 메인 콘텐츠 구역 (children 슬롯) */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {children}
        </div>

        {/* 우측 사이드바 구역: 통계(analytics)와 팀 피드(team)를 병렬로 배치합니다 */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200">
            {analytics}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
            {team}
          </div>
        </div>
      </div>
    </div>
  );
}
