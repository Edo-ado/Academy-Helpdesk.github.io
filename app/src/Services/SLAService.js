// src/services/SLAsService.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/SLAController';

const SLAsService = {
    getAllSLA: () => axios.get(`${API_URL}`),
    CreateSLA: (MaxTimeResponse, MaxTimeResolution) => axios.post(`${API_URL}/CreateSLA`, { MaxTimeResponse, MaxTimeResolution }),

};

export default SLAsService;