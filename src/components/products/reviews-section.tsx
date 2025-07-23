"use client"

import { useEffect, useState } from "react"
import type { Review } from "@/lib/types"
import { getReviewsByProductId } from "@/lib/reviews"
import ReviewCard from "./review-card"
import ReviewForm from "./review-form"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ReviewsSectionProps {
  productId: string
  initialReviews: Review[]
}

export default function ReviewsSection({ productId, initialReviews }: ReviewsSectionProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)

  const handleReviewAdded = () => {
    // In a real app, we would fetch the updated reviews
    setReviews(getReviewsByProductId(productId))
    setShowForm(false)
  }

  console.log("ReviewsSection rendered with productId:", productId, "and initialReviews:", initialReviews)

  const userHasReviewed = user && reviews.some((review) => review.userId === user.id)

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  return (
    <div className="mt-12 border-t pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        {user ? (
          !userHasReviewed && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {showForm ? "Cancel" : "Write a Review"}
            </button>
          )
        ) : (
          <Link
            href={`/login?redirect=/products/${productId}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Login to Review
          </Link>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          {!user && (
            <Link href={`/login?redirect=/products/${productId}`}>
              <Button className="mt-4">Login to Review</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
