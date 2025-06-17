import type { Review } from "./types"

const reviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Perfect fit and super comfortable. I wear this tee all the time!",
    date: "2023-05-15T14:30:00Z",
    verified: true,
  },
  {
    id: "2",
    productId: "1",
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Great quality, but runs slightly large. Consider sizing down.",
    date: "2023-05-10T09:15:00Z",
    verified: true,
  },
  {
    id: "3",
    productId: "2",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Love the vintage look! Gets compliments every time I wear it.",
    date: "2023-05-18T11:20:00Z",
    verified: true,
  },
  {
    id: "4",
    productId: "3",
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "The artwork is amazing and the shirt quality is top-notch!",
    date: "2023-05-20T10:30:00Z",
    verified: true,
  },
]

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((review) => review.productId === productId)
}

export function getReviewsByUserId(userId: string): Review[] {
  return reviews.filter((review) => review.userId === userId)
}

export function addReview(review: Omit<Review, "id" | "date">): Review {
  const newReview: Review = {
    ...review,
    id: `review-${reviews.length + 1}`,
    date: new Date().toISOString(),
  }

  // In a real app, you would save this to a database
  reviews.push(newReview)
  console.log("New review added:", newReview)

  return newReview
}
