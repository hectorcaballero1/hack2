import { api } from './api';
import type { TeamMembersResponse, MemberTasksResponse } from '../types';

export const teamService = {
  async getMembers(): Promise<TeamMembersResponse> {
    const response = await api.get<TeamMembersResponse>('/team/members');
    return response.data;
  },

  async getMemberTasks(memberId: string): Promise<MemberTasksResponse> {
    const response = await api.get<MemberTasksResponse>(`/team/members/${memberId}/tasks`);
    return response.data;
  },
};
