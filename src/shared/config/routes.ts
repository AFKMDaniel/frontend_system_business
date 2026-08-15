export const ROUTES = {
  login: '/login',
  register: '/register',
  home: '/',
  forbidden: '/forbidden',
  team: '/teams/:teamId',
  teamMembers: '/teams/:teamId/members',
  teamMeetings: '/teams/:teamId/meetings',
} as const
