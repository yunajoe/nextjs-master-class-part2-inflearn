"use cache";

import { deleteAuthor, getSuggestions } from "@/app/mission-actions";

export default async function SuggestionList({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  new Promise((resolve) => setTimeout(resolve, 3000));
  const resolvedId = await params;
  const boardId = resolvedId.id;

  // board 상세 조회
  const suggestions = await getSuggestions(boardId);
  return (
    <div>
      {suggestions.map((suggestion) => (
        <li key={suggestion.id}>
          <div>
            <p className="text-xs font-bold text-slate-400 mb-2 bg-slate-100 inline-block px-2 py-1 rounded">
              작성자: {suggestion.author}
            </p>
            <p className="text-slate-800 font-medium text-lg">
              {suggestion.content}
            </p>
          </div>
          <form action={deleteAuthor.bind(null, suggestion.id, boardId)}>
            <button type="submit">삭제!</button>
          </form>
        </li>
      ))}
    </div>
  );
}
