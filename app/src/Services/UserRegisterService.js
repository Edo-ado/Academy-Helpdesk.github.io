// src/Services/UserService.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/UserRegisterController';

const UserRegisterService = {

  getAllUsers: () => axios.get(`${API_URL}/index`),
  getUserById: (id) => axios.get(`${API_URL}/get/${id}`),
  getAllStudents: () => axios.get(`${API_URL}/allStudents`),
  loginUser: (credentials) => axios.post(`${API_URL}/login`, credentials),
  createUser: (userData) => axios.post(`${API_URL}/create`, userData),
};

export default UserRegisterService;
