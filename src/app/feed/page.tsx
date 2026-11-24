// src/app/feed/page.tsx
import Link from "next/link";

const photos = [
  { id: "1", title: "아름다운 풍경", author: "Elena" },
  { id: "2", title: "멋진 건축물", author: "Leo" },
];

export default function FeedPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6">글로벌 사진 피드</h1>
      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white"
          >
            <h3 className="text-xl font-bold">{photo.title}</h3>
            <p className="text-gray-500 mb-4">Photographer: {photo.author}</p>

            {/* 💡 함정의 스위치: 사용자는 진짜 /photo 페이지로 이동한다고 생각하며 링크를 클릭합니다. */}
            <Link
              href={`/photo/${photo.id}`}
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
            >
              사진 상세보기
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
