import { Star as StarIcon } from 'lucide-react'

import { useTranslation } from '@/shared/i18n'
import { cn } from '@/shared/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'

type RatingProps = {
  rate: number
  onChange?: (value: number) => void
  className?: string
}

export function Rating({ rate, onChange, className }: RatingProps) {
  const { t } = useTranslation()
  const clamped = Math.max(0, Math.min(5, rate))
  const rounded = Math.round(clamped * 2) / 2
  const stars = [0, 1, 2, 3, 4]
  const isInteractive = onChange != null

  const content = (
    <div
      role={isInteractive ? 'group' : 'img'}
      aria-label={isInteractive ? undefined : t('task.rating', { value: rounded })}
      className={cn('flex w-full items-center gap-0.5', className)}
    >
      {stars.map((i) => {
        const fill = Math.max(0, Math.min(1, rounded - i)) * 100
        const star = (
          <div className="relative h-full w-full">
            <StarIcon
              className="text-muted-foreground absolute inset-0 size-full"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
              <StarIcon className="size-full fill-amber-400 text-amber-500" strokeWidth={1.5} />
            </div>
          </div>
        )

        return isInteractive ? (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            aria-label={t('task.rating', { value: i + 1 })}
            className="relative aspect-square min-w-4 flex-1 cursor-pointer transition-transform hover:scale-110 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2"
          >
            {star}
          </button>
        ) : (
          <div key={i} className="relative aspect-square min-w-4 flex-1">
            {star}
          </div>
        )
      })}
    </div>
  )

  if (isInteractive) {
    return content
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="bottom">
          {rate}/5
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
