"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addReview } from "@/lib/reviews"
import StarRatingInput from "./star-rating-input"
import { useAuth } from "@/components/auth/auth-context"

interface ReviewFormProps {
  productId: string
  onReviewAdded: () => void
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      return
    }

    setIsSubmitting(true)

    // In a real app, this would be an API call
    addReview({
      productId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment,
    })

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setRating(5)
      setComment("")

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onReviewAdded()
      }, 3000)
    }, 1000)
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-medium">Write a Review</h3>

      {showSuccess ? (
        <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800">
          Thank you for your review! It has been submitted successfully.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Rating</label>
            <StarRatingInput rating={rating} onChange={setRating} />
          </div>

          <div>
            <label htmlFor="comment" className="mb-1 block text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Share your thoughts about this product"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}
    </div>
  )
}
