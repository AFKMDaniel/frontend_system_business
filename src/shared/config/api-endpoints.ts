export const API_ENDPOINTS = {
  auth: {
    login: '/users/login',
    logout: '/users/logout',
    refresh: '/jwt/refresh',
  },
  users: {
    me: '/users/me',
    register: '/users/register',
    joinTeam: '/users/join-team',
  },
  admin: {
    panel: '/admin',
    createTeam: '/admin/create-team',
  },
  calendar: '/calendar',
  teams: {
    get: (teamId: number) => `/teams/${teamId}/`,
    members: (teamId: number) => `/teams/${teamId}/members`,
    member: (teamId: number, userId: number) => `/teams/${teamId}/members/${userId}`,
    meetings: (teamId: number) => `/teams/${teamId}/meeting`,
    meeting: (teamId: number, meetingId: number) => `/teams/${teamId}/meeting/${meetingId}`,
    meetingParticipants: (teamId: number, meetingId: number) =>
      `/teams/${teamId}/meeting/${meetingId}/participants`,
    tasks: (teamId: number) => `/teams/${teamId}/tasks`,
    task: (teamId: number, taskId: number) => `/teams/${teamId}/tasks/${taskId}`,
    taskAvgGrade: (teamId: number) => `/teams/${teamId}/tasks/avg_grade`,
    taskCreate: (teamId: number) => `/teams/${teamId}/tasks/create-task`,
    taskUpdate: (teamId: number, taskId: number) =>
      `/teams/${teamId}/tasks/update-task/${taskId}`,
    taskUpdateStatus: (teamId: number, taskId: number) =>
      `/teams/${teamId}/tasks/update-task/${taskId}/status`,
    taskDelete: (teamId: number, taskId: number) =>
      `/teams/${teamId}/tasks/delete-task/${taskId}`,
  },
  comments: {
    list: (teamId: number, taskId: number) => `/teams/${teamId}/tasks/${taskId}/comments`,
    item: (teamId: number, taskId: number, commentId: number) =>
      `/teams/${teamId}/tasks/${taskId}/comments/${commentId}`,
  },
} as const
