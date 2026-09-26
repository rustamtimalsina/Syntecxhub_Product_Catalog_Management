import axios from 'axios';

const API_BASE_URL = 'http://localhost:5051/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Fetch products, with optional search/category/page/limit
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

// client/src/api/products.js
export const getProductById = async (id) => {
  const response = await fetch(`http://localhost:5051/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  return response.json();
};

export const getCatalogStats = async () => {
  const response = await api.get('/products/stats/catalog');
  return response.data;
};