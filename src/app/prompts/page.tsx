"use client";

import { PromptsData } from "@/lib/db";
import { useState } from "react";

function page() {
  const [prompts, setPrompts] = useState<PromptsData[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = () => {};

  const handleEditClick = (id: number) => {};

  const handleDelete = (id: number) => {};
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-slate-800">
          📚 교육용 AI 프롬프트 보관소
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md border border-slate-200"
        >
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "✏️ 프롬프트 수정" : "✨ 새 프롬프트 등록"}
          </h2>
          <div className="space-y-4">
            <input
              className="w-full p-3 border border-slate-300 rounded-lg outline-none"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full p-3 border border-slate-300 rounded-lg h-32 outline-none"
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-lg cursor-pointer"
              >
                {/* {editingId ? "데이터 업데이트" : "프롬프트 저장"} */}
              </button>
              {/* {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    // setEditingId(null);
                    // setTitle("");
                    // setContent("");
                  }}
                  className="px-6 bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  취소
                </button>
              )} */}
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {prompts.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {p.title}
                </h3>
                <p className="text-slate-600 mb-3 whitespace-pre-wrap">
                  {p.contents}
                </p>
                <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
                  최근 갱신: {new Date(p.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex sm:flex-col gap-2 justify-center">
                <button
                  onClick={() => handleEditClick(p.id)}
                  className="px-5 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg cursor-pointer"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-5 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg cursor-pointer"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
