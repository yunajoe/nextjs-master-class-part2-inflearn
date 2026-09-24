import { createProductAction } from "@/app/action";
import SubmitButton from "@/app/components/submit-button";

function page() {
  return (
    <div className="p-10 font-sans max-w-md bg-white rounded-lg shadow-md mx-auto mt-10 border border-gray-100">
      <h1 className="text-[#0070f3] mt-0 mb-2 text-2xl font-bold">
        새로운 상품 통제소
      </h1>

      <p className="text-gray-500 text-sm mb-5">
        Pending UI 방어선이 구축된 폼 시스템
      </p>

      <hr className="border-gray-200 my-5" />

      {/* Server Action이 연결된 부모 폼 */}
      <form action={createProductAction} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="상품명을 입력하세요"
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition-all"
        />
        <input
          type="number"
          name="price"
          placeholder="가격을 입력하세요"
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition-all"
        />
        {/* 부모 폼의 상태를 추적하는 자식 버튼 */}
        <SubmitButton />
      </form>
    </div>
  );
}

export default page;
