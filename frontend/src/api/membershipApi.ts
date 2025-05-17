// src/api/membershipApi.ts
import api from './axiosConfig';

interface CreateMembershipRequest {
  type: string;
  price: number;
  paymentMethod: 'Online' | 'OnSite';
  isPaid: boolean;
}

export const membershipApi = {
  createMembership: (data: CreateMembershipRequest) => 
    api.post('/memberships', data)
};