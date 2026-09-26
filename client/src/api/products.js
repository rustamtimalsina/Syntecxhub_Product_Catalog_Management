import axios from 'axios';

const API_BASE = 'http://localhost:5051/api/products';

const getAuthHeaders = () => {
  const token = localStorage.getItem('technova_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getProducts = async (params = {}) => {
  const response = await axios.get(API_BASE, { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(API_BASE, productData, getAuthHeaders());
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_BASE}/${id}`, productData, getAuthHeaders());
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
  return response.data;
};