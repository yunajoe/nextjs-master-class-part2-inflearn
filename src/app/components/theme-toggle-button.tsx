"use client";
import { toggleThemeAction } from "@/app/action";
import { useTransition } from "react";

function ThemeToggleButton() {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleThemeAction();
    });
  };
  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        px-6 py-3 rounded-full font-bold shadow-md transition-all duration-300 flex items-center justify-center gap-2 min-w-[160px]
        ${isPending ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#0070f3] hover:bg-blue-700 text-white cursor-pointer"}
      `}
    >
      {isPending ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="<http://www.w3.org/2000/svg>"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          테마 변경 중...
        </>
      ) : (
        "🌗 다크 모드 전환"
      )}
    </button>
  );
}

export default ThemeToggleButton;
