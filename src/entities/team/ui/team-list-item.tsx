import { useState } from 'react'
import { ChevronRight, Loader2, Users } from 'lucide-react'
import { NavLink, generatePath } from 'react-router-dom'

import { taskApi } from '@/entities/task'
import { getRoleLabel } from '@/entities/user'
import type { TeamMemberSchema } from '@/entities/user'
import { useTranslation } from '@/shared/i18n'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/config'
import { Rating } from '@/shared/ui/rating'

type TeamListItemProps = {
  membership: TeamMemberSchema
}

export function TeamListItem({ membership }: TeamListItemProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const avgGrade = taskApi.useGetAvgTaskGradeQuery(
    { teamId: membership.team.id },
    { skip: !expanded },
  )

  return (
    <div>
      <div className="bg-card hover:bg-muted/40 flex items-center gap-4 rounded-xl border py-3.5 pr-2 pl-4 transition-colors">
        <NavLink
          to={generatePath(ROUTES.team, { teamId: String(membership.team.id) })}
          className="flex min-w-0 flex-1 items-center gap-4"
        >
          <div className="bg-muted text-muted-foreground flex size-11 shrink-0 items-center justify-center rounded-lg border">
            <Users className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{membership.team.name}</p>
            {membership.role ? (
              <p className="text-muted-foreground truncate text-xs">
                {getRoleLabel(t, membership.role)}
              </p>
            ) : null}
          </div>
        </NavLink>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="text-muted-foreground hover:bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronRight className={cn('size-4 transition-transform', expanded && 'rotate-90')} />
        </button>
      </div>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="bg-muted/40 mt-2 flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
            <p className="text-muted-foreground text-xs font-medium">{t('home.avgGrade')}</p>
            {avgGrade.isLoading ? (
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            ) : avgGrade.isError || avgGrade.data == null ? (
              <p className="text-destructive text-sm">{t('home.avgGradeError')}</p>
            ) : (
              <div className="flex items-center gap-2">
                <Rating rate={avgGrade.data.grade} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
