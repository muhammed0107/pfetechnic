import { mainApi, aiApi } from './api';
import axios from 'axios';
import { API_AI_URL } from './api';
// Get health stats for user
export const getHealthStats = async (userId: string, days: number = 7) => {
  try {
    const response = await mainApi.get(`/stats/user/${userId}?days=${days}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to get health stats'
    );
  }
};

// Update daily stats
export const updateDailyStats = async (
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

// Get workout plan
export const getWorkoutPlan = async (userId: string) => {
  try {
    const response = await mainApi.get(`/plan/user/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to get workout plan'
    );
  }
};

// Generate new workout plan
export const generateWorkoutPlan = async (planData: any) => {
  try {
    const response = await aiApi.post('api/plan/generate', planData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to generate workout plan'
    );
  }
};

// Save workout plan
export const saveWorkoutPlan = async (userId: string, planData: any) => {
  try {
    const response = await mainApi.post('/plan/save', {
      userId,
      ...planData,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to save workout plan'
    );
  }
};

// Send message to AI health assistant
export const sendAiMessage = async (
  sessionId: string,
  chatType: string,
  prompt: string
) => {
  try {
    const response = await aiApi.post('/api/chat', {
      session_id: sessionId,
      chat_type: chatType,
      prompt,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to get AI response'
    );
  }
};

// Health prediction for diabetes

// Health prediction for blood pressure

const API_BASE_URL = `${API_AI_URL}/api`;

interface DiabetesPredictionInput {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree: number;
  age: number;
}

interface BloodPressurePredictionInput {
  age: number;
  systolic_pressure: number;
  diastolic_pressure: number;
}

interface PredictionResponse {
  prediction: string;
  probability?: number;
  recommendations?: string[];
}

export const predictDiabetes = async (
  data: DiabetesPredictionInput
): Promise<PredictionResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/diabetes/predict`, data);
    return response.data;
  } catch (error) {
    console.error('Error predicting diabetes:', error);
    throw error;
  }
};

// Health prediction for blood pressure
export const predictBloodPressure = async (
  data: BloodPressurePredictionInput
): Promise<PredictionResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/blood_pressure/predict`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error predicting blood pressure:', error);
    throw error;
  }
};
