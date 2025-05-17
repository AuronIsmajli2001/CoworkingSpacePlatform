// membershipApi.ts
import api from './axiosConfig';

export const membershipApi = {
  getPlans: async () => {
    const response = await api.get('/memberships');
    return response.data;
  },
  createPlan: async (planData: FormData) => {
    const response = await api.post('/memberships', planData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  updatePlan: async (id: string, planData: FormData) => {
    const response = await api.put(`/memberships/${id}`, planData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deletePlan: async (id: string) => {
    const response = await api.delete(`/memberships/${id}`);
    return response.data;
  }
};