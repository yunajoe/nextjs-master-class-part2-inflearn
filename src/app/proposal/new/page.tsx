"use client";

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="p-3 cursor-pointer border-2 border-blue-700"
    >
      제출하기
    </button>
  );
}
import { proposalActions } from "@/app/proposal-action";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
const initialState = {
  success: false,
  message: "",
};
function Page() {
  const [state, dispatch] = useActionState(proposalActions, initialState);

  console.log("State", state);
  return (
    <form
      action={dispatch}
      className="flex flex-col items-center justify-center border-2 border-blue-300 max-w-3xl"
    >
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xl">제목</label>
        <input
          name="title"
          type="text"
          placeholder="제안 제목을 써주세요."
          className="p-2"
        />
      </div>
      <FormButton />
      {state.message && (
        <div
          style={{
            color: "red",
            fontSize: "30px",
            fontWeight: "bold",
            padding: "20px",
          }}
        >
          {state.message}
        </div>
      )}
    </form>
  );
}

export default Page;
