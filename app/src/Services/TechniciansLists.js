// src/services/TechniciansLists.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/UserController';

const TechniciansLists = {
  getAllTechnicians: () => axios.get(API_URL + '/GetAllTechnicians')
};

export default TechniciansLists;
