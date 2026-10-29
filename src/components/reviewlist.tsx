import { deleteReviewAction, getReviews } from "@/app/actions";

async function ReviewList({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const resolvedParams = await paramsPromise;
  const productId = resolvedParams.id;
  const reviews = await getReviews(productId);
  return (
    <ul>
      {reviews.map((review) => (
        <li>
          <strong>{review.author}</strong>: {review.content}
          <form action={deleteReviewAction.bind(null, review.id, productId)}>
            <button
              type="submit"
              style={{
                marginLeft: "15px",
                color: "white",
                backgroundColor: "#ef4444",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
                border: "none",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              리뷰 삭제
            </button>
          </form>
        </li>
      ))}
      {reviews.length === 0 && (
        <p style={{ color: "gray" }}>등록된 리뷰가 없습니다.</p>
      )}
    </ul>
  );
}

export default ReviewList;
