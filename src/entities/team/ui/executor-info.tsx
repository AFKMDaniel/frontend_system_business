import { Loader2 } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip'

import { teamApi } from '../api'
import { selectMemberByUserId } from '../lib/member-adapter'

// TODO: ask backend to return the executor email in the task response,
// then pass it in as a prop and remove this team members query subscription.
type ExecutorInfoProps = {
  teamId: number
  userId: number | null
}

export function ExecutorInfo({ teamId, userId }: ExecutorInfoProps) {
  const { member, isLoading } = teamApi.useGetTeamMembersQuery(
    { teamId },
    {
      selectFromResult: ({ data, isLoading }) => ({
        isLoading,
        member:
          userId != null && data
            ? selectMemberByUserId(data, userId)
            : undefined,
      }),
    },
  )

  if (isLoading && !member) {
    return <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
  }

  if (userId == null || !member) {
    return <span className="text-muted-foreground text-xs">Unassigned</span>
  }

  const email = member.user.email

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar size="sm">
            <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{email}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
