// src/services/TechniciansLists.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/UserController';

const TechniciansLists = {
  getAllTechnicians: () => axios.get(API_URL + '/GetAllTechnicians'),
  getTechnicianById: (id) => axios.get(`${API_URL}/GetDetailByIdAll/${id}`),
  getSpecialitiesByUserId: (id) => axios.get(`${API_URL}/GetSpecialitiesByUserID/${id}`)
};

export default TechniciansLists;