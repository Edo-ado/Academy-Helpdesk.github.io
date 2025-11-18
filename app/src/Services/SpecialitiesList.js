// src/services/TechniciansLists.js
import axios from 'axios';
import { get } from 'react-hook-form';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/SpecialitiesController';


const TechniciansLists = {
getAll: () => axios.get(`${API_URL}/GetAll`),
GetAllTags: () => axios.get(`${API_URL}/GetAllTags`),
getById: (id) => axios.get(`${API_URL}/GetById/${id}`)
};

export default TechniciansLists;