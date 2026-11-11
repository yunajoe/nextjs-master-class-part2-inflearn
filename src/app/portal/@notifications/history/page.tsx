import Link from "next/link";

export default function NotificationsHistoryPage() {
  return (
    <div className="bg-amber-100 p-6 rounded-3xl shadow-sm border border-amber-300 h-full">
      <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
        <span>📜</span> 알림 히스토리
      </h3>
      <ul className="space-y-3 mb-6">
        <li className="p-3 bg-white rounded-xl text-amber-900 font-medium text-sm border border-amber-100">
          지난주 공지: 서버 점검 안내
        </li>
        <li className="p-3 bg-white rounded-xl text-amber-900 font-medium text-sm border border-amber-100">
          지난달 공지: 신규 강의 오픈
        </li>
      </ul>
      <Link
        href="/portal"
        className="text-sm font-bold text-amber-800 underline"
      >
        ← /portal 로 돌아가기
      </Link>
    </div>
  );
}
