// src/services/TechniciansLists.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/UserController';
const API_URL_SPECIALITIES = 'http://localhost/Academy-Helpdesk.github.io/api/SpecialitiesController';

const TechniciansLists = {
  getAllTechnicians: () => axios.get(`${API_URL}/GetAllTechnicians`),
  getTechnicianById: (id) => axios.get(`${API_URL}/GetDetailByIdAll/${id}`),
  GetDetailByIdAll: (id) => axios.get(`${API_URL}/GetDetailByIdAll/${id}`),
  GetSpecialitiesInformationByUserID: (userId) => axios.get(`${API_URL_SPECIALITIES}/GetSpecialitiesInformationByUserID/${userId}`)  
};

export default TechniciansLists;