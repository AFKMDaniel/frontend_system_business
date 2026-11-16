export const ROUTES = {
  login: '/login',
  register: '/register',
  home: '/',
  forbidden: '/forbidden',
  team: '/teams/:teamId',
  teamTask: '/teams/:teamId/tasks/:taskId',
  teamMembers: '/teams/:teamId/members',
  teamMeetings: '/teams/:teamId/meetings',
} as const
