import { adminLogin } from "@/app/action";

function page() {
  return (
    <div>
      <h1 className="mb-3">🛡️ Korapaduck 관리자 인가 센터</h1>
      <form action={adminLogin} className="flex flex-col gap-8">
        <input name="code" type="text" className="border-2 border-blue-700" />
        <button
          type="submit"
          className="cursor-pointer p-3 bg-[#0070f3] hover:bg-blue-700 text-white rounded-md font-bold transition-colors"
        >
          [ 게이트웨이 진입 ]
        </button>
      </form>
    </div>
  );
}

export default page;
