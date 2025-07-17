import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllStudents = () => {
  return axios.get(`${API_URL}/students`);
};
