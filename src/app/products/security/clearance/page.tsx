"use client";
import { createSecurity } from "@/app/action";
import { useActionState } from "react";

function page() {
  const [state, dispatchAction, isPending] = useActionState(createSecurity, {
    count: 0,
    success: false,
    message: "",
  });
  return (
    <div className="flex flex-col items-center gap-8 max-w-2xl w-full mx-auto border border-amber-500">
      <h1 className="text-3xl font-bold">🛡️ 1급 보안 인가 발급 센터</h1>
      <form className="border border-amber-300" action={dispatchAction}>
        <div className="flex gap-8">
          <label className="text-lg">사번:</label>
          <input name="employee-id" required type="text" placeholder="사번" />
        </div>
        <div className="flex gap-8">
          <label className="text-lg">부서:</label>
          <input name="department" required type="text" placeholder="부서" />
        </div>

        <button type="submit">{isPending ? "발급 중..." : "발급하기"}</button>
        {/* 4. 서버 응답 메시지 표시 */}
        {state.message && (
          <p style={{ color: state.success ? "green" : "red" }}>
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default page;
