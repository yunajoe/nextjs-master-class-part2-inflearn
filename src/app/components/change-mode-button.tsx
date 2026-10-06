"use client";

import { proposalDarkModeActions } from "@/app/proposal-action";
import { useTransition } from "react";

function ChangeModeButton() {
  const [isPending, startTransition] = useTransition();
  const handleChangeMode = () => {
    startTransition(async () => {
      await proposalDarkModeActions();
    });
  };
  return (
    <button
      className="cursor-pointer p-4 border-2 border-blue-500"
      disabled={isPending}
      onClick={handleChangeMode}
    >
      [ 👑 VIP 리뷰어 모드 켜기 ]
    </button>
  );
}

export default ChangeModeButton;
