// src/services/CategoriesList.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/CategoriesController';

const CategoriesList = {
   getAllCategories: () => axios.get(`${API_URL}`),
    getCategoryById: (id) => axios.get(`${API_URL}/GetCategoryById/${id}`),
    GetCategoryDetailsByID: (id) => axios.get(`${API_URL}/details/${id}`)
};

export default CategoriesList;