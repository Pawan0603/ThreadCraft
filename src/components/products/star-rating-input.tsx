"use client"

import { Star } from "lucide-react"

interface StarRatingInputProps {
  rating: number
  onChange: (rating: number) => void
  max?: number
}

export default function StarRatingInput({ rating, onChange, max = 5 }: StarRatingInputProps) {
  return (
    <div className="flex items-center">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1
        return (
          <button key={`star-input-${index}`} type="button" onClick={() => onChange(starValue)} className="p-1">
            <Star className={`h-6 w-6 ${starValue <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
        )
      })}
    </div>
  )
}
