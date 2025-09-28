import type { Review } from "@/lib/types"
import StarRating from "./star-rating"
import Image from "next/image"
// import { formatDistanceToNow } from "date-fns"
import { CheckCircle2 } from "lucide-react"

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {

  const createdAt = new Date(review.createdAt); // date from your DB
  const now = new Date();

  const diffInMs = now.getTime() - createdAt.getTime();

  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInMs / (1000 * 60));
  const diffInHr = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Logic
  let timeAgo = "";

  if (diffInDays > 0) {
    timeAgo = `${diffInDays} days ago`;
  } else if (diffInHr > 0) {
    timeAgo = `${diffInHr} hours ago`;
  } else if (diffInMin > 0) {
    timeAgo = `${diffInMin} minutes ago`;
  } else {
    timeAgo = `${diffInSec} seconds ago`;
  }

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={review.userAvatar || "/placeholder.svg?height=40&width=40"}
            alt={review.user.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{review.user.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-gray-500">{timeAgo}</span>
              </div>
            </div>
            {review.verified && (
              <span className="flex items-center text-xs text-green-600">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified Purchase
              </span>
            )}
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}
