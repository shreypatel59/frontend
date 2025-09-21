import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API || 'http://localhost:5000/api' });
API.interceptors.request.use(cfg => {
  const tok = localStorage.getItem('token');
  if (tok) cfg.headers.Authorization = 'Bearer ' + tok;
  return cfg;
});
export default API;