import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -------------------------------------------------------------------------- */
/*  CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

export const SERVER_URL = 'https://back-1-oq0d.onrender.com'; // <— change ici si ton back change
export const API_BASE_URL = `${SERVER_URL}/api`;
export const API_AI_URL = 'https://backend-ai-2.onrender.com';

/* -------------------------------------------------------------------------- */
/*  AXIOS INSTANCES                                                            */
/* -------------------------------------------------------------------------- */

export const mainApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const aiApi = axios.create({
  baseURL: API_AI_URL,
  headers: { 'Content-Type': 'application/json' },
});

/* -------- Ajoute le token dans toutes les requêtes mainApi -------- */
mainApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@health_app_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* -------------------------------------------------------------------------- */
/*  HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Construit l’URL complète d’une image à partir de son nom.
 * - Si `imageName` est déjà une URL (commence par http), on la renvoie telle-quelle.
 * - Sinon on préfixe par `${SERVER_URL}/uploads/`.
 */
export const getImageUrl = (imageName: string): string => {
  if (!imageName) return '';
  if (imageName.startsWith('http')) return imageName;
  return `${SERVER_URL}/uploads/${imageName}`;
};

export default { mainApi, aiApi };
