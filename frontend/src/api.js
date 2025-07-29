import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getLands = async () => {
  try {
    const response = await api.get('/lands');
    return response.data;
  } catch (error) {
    console.error('Error fetching lands:', error.response?.data || error.message);
    throw error;
  }
};

export const getLandById = async (id) => {
  try {
    const response = await api.get(`/lands/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching land with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const insertMeasurement = async (measurement) => {
  try {
    const response = await api.post('/lands', {
      name: measurement.name,
      data_area_ha: measurement.data_area_ha,
      data_area_acres: measurement.data_area_acres,
      boundary_points: measurement.points,
      land_type: measurement.landType,
      seed_amount_min: measurement.seedAmountMin,
      seed_amount_max: measurement.seedAmountMax,
      fertilizer_total: measurement.fertilizerTotal,
      date: measurement.date,
    });
    return response.data;
  } catch (error) {
    console.error('Error inserting measurement:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteLand = async (id) => {
  try {
    const response = await api.delete(`/lands/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting land with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export default api;