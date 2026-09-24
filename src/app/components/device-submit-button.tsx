"use client";
import { useFormStatus } from "react-dom";

function DeviceSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="p-4 bg-gray-200 cursor-pointer w-30 text-black"
    >
      {pending ? <span>저장하는 중</span> : <span>저장</span>}
    </button>
  );
}

export default DeviceSubmitButton;
