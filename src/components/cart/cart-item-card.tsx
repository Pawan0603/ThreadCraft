"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "./cart-context"
import { Trash, MinusIcon, PlusIcon } from "lucide-react"

interface CartItemCardProps {
  item: CartItem
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { removeFromCart, updateQuantity } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item._id, item.size, newQuantity)
    }
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
      <div className="relative aspect-square h-20 w-20 overflow-hidden rounded bg-slate-100 sm:h-24 sm:w-24">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80px, 96px"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="font-medium line-clamp-1">{item.name}</h3>
          <p className="ml-2 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        </div>

        <p className="text-sm text-slate-500">Size: {item.size}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <MinusIcon className="h-3 w-3" />
            </Button>
            <span className="mx-2 w-6 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromCart(item._id, item.size)}
            className="h-7 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
