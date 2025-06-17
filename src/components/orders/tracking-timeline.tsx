import type { TrackingEvent } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrackingTimelineProps {
  events: TrackingEvent[]
}

export default function TrackingTimeline({ events }: TrackingTimelineProps) {
  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <div className="space-y-4">
      {sortedEvents.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                index === 0 ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-background",
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
            </div>
            {index < sortedEvents.length - 1 && <div className="h-full w-0.5 bg-muted"></div>}
          </div>
          <div className="pb-6">
            <div className="flex flex-col gap-0.5">
              <h4 className="font-medium">{event.status}</h4>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(event.date), "MMM d, yyyy 'at' h:mm a")}
                {event.location && ` • ${event.location}`}
              </p>
              <p className="mt-1 text-sm">{event.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
