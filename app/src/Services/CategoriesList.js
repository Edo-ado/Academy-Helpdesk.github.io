// src/services/CategoriesList.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/CategoriesController';

const CategoriesList = {
   getAllCategories: () => axios.get(`${API_URL}`),
     GetAllCategoriesListActive: () => axios.get(`${API_URL}/GetAllCategoriesListActive`),
    GetCategoryById: (id) => axios.get(`${API_URL}/GetCategoryById/${id}`),
    GetCategoryDetailsByID: (id) => axios.get(`${API_URL}/details/${id}`),
    UpdateCategoryByid: (id, data) => axios.put(`${API_URL}/UpdateCategoryByid/${id}`, data),
   CreateCategory: (data) => 
  axios.post(`${API_URL}/CreateCategory`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  }),
   DeleteCategoryById: (id) => axios.patch(`${API_URL}/DeleteCategory/${id}`),
   ActivateCategory: (id) => axios.patch(`${API_URL}/ActivateCategory/${id} `),
  

};

export default CategoriesList;