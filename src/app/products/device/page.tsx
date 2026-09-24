import { createDevice } from "@/app/action";
import DeviceSubmitButton from "@/app/components/device-submit-button";

function page() {
  return (
    <div className="border border-white max-w-3xl flex flex-col items-center mx-auto gap-8">
      <h1 className="text-3xl">보안 기기 등록 </h1>
      <form
        action={createDevice}
        className="flex flex-col items-center gap-4 w-xl"
      >
        <input name="name" type="text" placeholder="보안 기기 이름" />
        <input
          name="price"
          required
          type="number"
          placeholder="보안 기기 가격"
        />

        <DeviceSubmitButton />
      </form>
    </div>
  );
}

export default page;
