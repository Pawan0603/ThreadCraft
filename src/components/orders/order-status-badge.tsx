import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"

interface OrderStatusBadgeProps {
  status: Order["status"]
  className?: string
}

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "Pending":
        return "outline"
      case "Processing":
        return "secondary"
      case "Shipped":
        return "default"
      case "Out for Delivery":
        return "default"
      case "Delivered":
        return "success"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Badge variant={getVariant()} className={className}>
      {status}
    </Badge>
  )
}
