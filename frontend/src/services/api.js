import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 10000,
});

// Add token to requests if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password) => API.post('api-token-auth/', { username, password }),
  register: (data) => API.post('register/', data),
};

export const kitchenAPI = {
  getAll: () => API.get('kitchens/'),
  getOne: (id) => API.get(`kitchens/${id}/`),
  follow: (id) => API.post(`kitchens/${id}/follow/`),
  getFollowed: () => API.get('kitchens/followed/'),
};

export const menuAPI = {
  getTodayMenus: () => API.get('menus/'),
  getKitchenMenu: (kitchenId) => API.get(`menus/?kitchen_id=${kitchenId}`),
};

export const orderAPI = {
  create: (data) => API.post('orders/', data),
  getMyOrders: () => API.get('orders/'),
  updateStatus: (orderId, status) => API.post(`orders/${orderId}/update_status/`, { status }),
};

export const storyAPI = {
  create: (data) => {
    const formData = new FormData();
    if (data.image) formData.append('image', data.image);
    if (data.caption) formData.append('caption', data.caption);
    if (data.kitchenId) formData.append('kitchen', data.kitchenId);
    return API.post('stories/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default API;
