"use client"; // onClick 이벤트와 상태 훅을 다루기 위해 클라이언트 경계 선언

import { changeSettingAction } from "@/app/action";
import { useTransition } from "react";

export default function SettingButton({
  currentMode,
}: {
  currentMode: string;
}) {
  // 💡 React 19의 마법: 상태 변화의 우선순위를 백그라운드로 미루는 훅입니다.
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // 🚨 폼(form)이 아닌 버튼 클릭(onClick)으로 무거운 서버 액션을 호출할 때,
    // startTransition 래퍼 없이 생으로 호출하면 브라우저 메인 스레드가 멈춰 화면이 굳어버립니다.
    // 이 래퍼로 감싸주면 프레임워크가 "이 통신은 백그라운드에서 처리해라"라고 판단하여 스크롤 멈춤 현상(Blocking)을 방지합니다.
    startTransition(async () => {
      await changeSettingAction();
    });
  };

  const isFocus = currentMode === "focus";

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        px-8 py-4 rounded-2xl font-black shadow-xl transition-all duration-300 flex items-center justify-center gap-3 min-w-[240px]
        ${
          isPending
            ? "bg-slate-300 text-slate-500 cursor-not-allowed scale-95"
            : isFocus
              ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95"
              : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95"
        }
      `}
    >
      {isPending ? (
        <>
          <svg
            className="animate-spin h-6 w-6"
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
          환경 설정 중...
        </>
      ) : isFocus ? (
        "📖 일반 학습 모드로 복귀"
      ) : (
        "👁️ 집중 학습 모드 켜기"
      )}
    </button>
  );
}
