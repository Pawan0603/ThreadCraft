import { Star, StarHalf } from "lucide-react"

interface StarRatingProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
}

export default function StarRating({ rating, max = 5, size = "md" }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const iconClass = sizeClasses[size]

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`star-${i}`} className={`${iconClass} fill-yellow-400 text-yellow-400`} />
      ))}

      {hasHalfStar && <StarHalf className={`${iconClass} fill-yellow-400 text-yellow-400`} />}

      {Array.from({ length: max - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${iconClass} text-gray-300`} />
      ))}
    </div>
  )
}
