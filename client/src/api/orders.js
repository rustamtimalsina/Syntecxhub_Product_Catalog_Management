import axios from 'axios';

const API_BASE = 'http://localhost:5051/api/orders';

export const createOrder = async (orderData) => {
  const response = await axios.post(API_BASE, orderData);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};