"use client";

import {
  deleteReviewInstantAction,
  deleteReviewSoftAction,
} from "@/app/actions";

function DeleteButton({ reviewId }: { reviewId: string }) {
  return (
    <>
      <button
        className="text-black bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-bold cursor-pointer border-none transition-colors"
        onClick={() => deleteReviewSoftAction(reviewId)}
      >
        SOFT DeleteButton
      </button>{" "}
      <button
        className="text-black bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-bold cursor-pointer border-none transition-colors"
        onClick={() => deleteReviewInstantAction(reviewId)}
      >
        즉각 DeleteButton
      </button>
    </>
  );
}

export default DeleteButton;
