import api from './axiosConfig'; 

interface ReservationRequest {
  userId: string;
  spaceId: string;
  startDateTime: string;
  endDateTime: string;
  status?: 'Pending' | 'Confirmed' | 'Cancelled';
  paymentMethod: 'Online' | 'OnSite';
  isPaid: boolean;

 
}

export const reservationApi = {
  createReservation: async (data: ReservationRequest) => {
    const payload = {
      ...data,
      status: 'Pending', 
      created_at: new Date().toISOString() 
    };
    
    return await api.post('/reservations', payload);
  }
};