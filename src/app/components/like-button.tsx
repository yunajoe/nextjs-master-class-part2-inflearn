"use client";

import { toggleProductLikeAction } from "@/app/action";
import { useOptimistic } from "react";

export default function LikeButton({
  productId,
  initialLiked,
}: {
  productId: string;
  initialLiked: boolean;
}) {
  // const [optimisticCount, addOptimisticCount] = useOptimistic(
  //   initialCount, // 서버에서 가져온 진짜 초기 수량 (예: 3개)
  //   // 여기서 updateAmount는 위에서 addOptimisticCount(1)을 호출할 때 넘겨준 '1'이 됩니다.
  //   (currentState, updateAmount: number) => {
  //     return currentState + updateAmount; // 3 + 1 = 4 (새로운 가짜 수량)
  //   }

  const [optimisticLiked, addOptimisticLike] = useOptimistic(
    initialLiked,
    (currentState, optimisticValue: boolean) => optimisticValue, // 방아쇠가 당겨지면 복잡한 연산 없이 즉시 이 값으로 덮어씌웁니다.
  );

  const handleLike = async () => {
    //   1. 논리적 오류를 막기 위해 바뀔 상태를 미리 계산합니다. (true -> false, false -> true)
    const newLikeStatus = !optimisticLiked;

    // 2. 🚨 핵심: 서버에 요청을 보내기도 전에!
    // 화면 상태를 가짜(낙관적) 값으로 0.001초 만에 갱신하여 사용자를 속입니다.
    addOptimisticLike(newLikeStatus);
    try {
      // 3. 백그라운드에서 진짜 서버 액션을 조용히 호출합니다.
      // 여기서 우리가 의도한 1초의 지연이 발생하지만 화면은 이미 변해있습니다.
      await toggleProductLikeAction(productId, newLikeStatus);
    } catch (error) {
      // 4. 🚨 롤백 메커니즘: 만약 10% 확률로 서버 에러가 발생하면,
      // 프레임워크가 알아서 가짜 상태를 폐기하고 원래의 initialLiked 진짜 값으로 화면을 자동 복구시킵니다.
      alert(
        "⚠️ 서버 통신 실패: 좋아요 처리가 취소되고 원래 상태로 복구됩니다.",
      );
    }
  };

  return (
    <form action={handleLike}>
      <button
        type="submit"
        className={`
          flex items-center gap-2 px-4 py-2 border rounded-full font-bold text-lg cursor-pointer transition-all duration-200
          ${optimisticLiked ? "border-red-200 text-red-500 bg-red-50" : "border-gray-300 text-gray-400 bg-white hover:bg-gray-50"}
        `}
      >
        {/* 🚨 중요: 화면에는 props로 받은 진짜(initialLiked)가 아니라, 항상 낙관적 상태(optimisticLiked)를 렌더링해야 합니다. */}
        <span>{optimisticLiked ? "❤️" : "🤍"}</span>
        <span>{optimisticLiked ? "좋아요 취소" : "좋아요"}</span>
      </button>
    </form>
  );
}
