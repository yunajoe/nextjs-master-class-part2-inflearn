"use client";

import { proposalLikeActions } from "@/app/proposal-action";
import { useOptimistic, useTransition } from "react";

function ProposalLikeButton({
  itemId,
  likeCount,
}: {
  itemId: number;
  likeCount: number;
}) {
  const [optimisticLike, addOptimisticLike] = useOptimistic(
    likeCount,
    (current, increment: number) => current + increment,
  );
  const [isPending, startTransition] = useTransition();
  const handleVote = (id: number) => {
    startTransition(async () => {
      addOptimisticLike(1);
      await proposalLikeActions(id);
    });
  };
  return (
    <div>
      <span className="text-xl">좋아요 갯수: {optimisticLike}개</span>
      <button disabled={isPending} onClick={() => handleVote(itemId)}>
        [투표하기 버튼]
      </button>
    </div>
  );
}

export default ProposalLikeButton;
