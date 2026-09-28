import { makeProductAction } from "@/app/action";
import { useActionState } from "react";

const initialState = {
  success: false,
  message: "",
  attemptCount: 0,
};
function page() {
  const [state, formAction, isPending] = useActionState(
    makeProductAction,
    initialState,
  );
  return (
    <div className="p-10 font-sans max-w-md bg-white rounded-lg shadow-md mx-auto mt-10 border border-gray-100">
      <h1 className="text-[#0070f3] mt-0 mb-2 text-2xl font-bold">
        새로운 상품 통제소
      </h1>
      <p className="text-gray-500 text-sm mb-5">
        useActionState가 장착된 완벽한 피드백 시스템
      </p>
      <hr className="border-gray-200 my-5" />
      <form action={formAction} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="상품명을 입력하세요"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0070f3] text-white"
        />
        <input
          type="number"
          name="price"
          placeholder="상품명을 입력하세요"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0070f3]  text-white"
        />
        <button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
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
              안전하게 저장 중...
            </span>
          ) : (
            "상품 등록 시스템 가동"
          )}
        </button>
      </form>

      {/* 
       <button
      type="submit"
      disabled={pending}
      className={`p-4 border-none rounded-md font-bold transition-all shadow-sm flex justify-center items-center ${pending ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#0070f3] hover:bg-blue-700 text-white cursor-pointer"}`}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="<http://www.w3.org/2000/svg>" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          안전하게 저장 중...
        </span>
      ) : "상품 등록 시스템 가동"}
    </button> */}
      {state.message && (
        <div
          className={`
            p-4 mt-2 rounded-md border
            ${state.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}
          `}
        >
          <p className="m-0 mb-1 font-bold text-sm opacity-80">
            시도 횟수: {state.attemptCount}회
          </p>
          <p className="m-0 font-semibold">{state.message}</p>
        </div>
      )}
    </div>
  );
}

export default page;
