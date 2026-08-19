import { Star } from 'lucide-react'

import { useTranslation } from '@/shared/i18n'
import { cn } from '@/shared/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'

type RatingProps = {
  rate: number
  className?: string
}

export function Rating({ rate, className }: RatingProps) {
  const { t } = useTranslation()
  const clamped = Math.max(0, Math.min(5, rate))
  const rounded = Math.round(clamped * 2) / 2
  const stars = [0, 1, 2, 3, 4]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            role="img"
            aria-label={t('task.rating', { value: rounded })}
            className={cn('inline-flex gap-0.5', className)}
          >
            {stars.map((i) => {
              const fill = Math.max(0, Math.min(1, rounded - i)) * 100
              return (
                <div key={i} className="relative size-4">
                  <Star className="absolute inset-0 text-muted-foreground size-4" strokeWidth={1.5} />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${fill}%` }}
                  >
                    <Star className="size-4 fill-amber-400 text-amber-500" strokeWidth={1.5} />
                  </div>
                </div>
              )
            })}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {rate}/5
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
