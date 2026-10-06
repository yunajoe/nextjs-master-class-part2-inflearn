"use client";
import { authenticateAdminAction, AuthState } from "@/app/action";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full p-4 rounded-xl font-black transition-all shadow-lg text-white mt-2 ${
        pending
          ? "bg-slate-600 cursor-not-allowed scale-95"
          : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
      }`}
    >
      {pending ? "📡 암호화 통신 중..." : "🔐 게이트웨이 진입"}
    </button>
  );
}

const initialState: AuthState = { success: false, message: "" };

function page() {
  const [state, formAction] = useActionState(
    authenticateAdminAction,
    initialState,
  );
  return (
    <div>
      <h1 className="text-white text-3xl font-black mb-2 text-center tracking-tighter">
        🛡️ Korapaduck Admin
      </h1>
      <p className="text-slate-500 text-xs mb-8 text-center font-mono">
        Safe Redirection Protocol
      </p>
      <form action={formAction} className="flex flex-col gap-8">
        <input
          name="code"
          type="text"
          className="p-4 bg-slate-950 border border-slate-700 rounded-xl text-center text-white tracking-[0.2em] font-mono focus:border-indigo-500 outline-none transition-colors"
          placeholder="마스터 인가 코드 입력"
        />
        <LoginButton />

        {state?.message && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-400 text-center text-sm font-bold animate-pulse">
            ❌ {state.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default page;
