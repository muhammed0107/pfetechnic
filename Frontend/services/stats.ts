import { mainApi } from './api';

export interface DailyStats {
  _id: string;
  user: string;
  date: string;
  steps: number;
  caloriesBurned: number;
  createdAt: string;
  updatedAt: string;
}

export const updateStats = async (
  userId: string,
  date: string,
  steps: number,
  caloriesBurned: number
) => {
  try {
    const response = await mainApi.post('/stats', {
      userId,
      date,
      steps,
      caloriesBurned,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update stats');
  }
};

export const getStatsByUser = async (userId: string, days: number = 7) => {
  try {
    const response = await mainApi.get(`/stats/user/${userId}?days=${days}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch stats');
  }
};

export const getAllStats = async () => {
  try {
    const response = await mainApi.get('/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch all stats'
    );
  }
};
