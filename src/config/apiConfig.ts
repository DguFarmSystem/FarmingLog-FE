import axios from 'axios';

const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_BASE_DEV_URL; // 개발 서버 URL

  // URL이 '/'로 끝나면 'api/', 아니면 '/api/'
  return baseUrl.endsWith('/') ? `${baseUrl}api/` : `${baseUrl}/api/`;
};

const API_BASE_URL = getApiBaseUrl();

const apiConfig = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 요청 타임아웃 5초
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiConfig;