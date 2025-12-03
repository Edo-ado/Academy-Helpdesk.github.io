import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController';

const AutoTriageList = {
    // Obtener TODOS los tickets pendientes
    GetAllPendingTickets: () => 
        axios.get(`${API_URL}/GetAllPendingTickets`),
    
    // Obtener regla aplicable
    GetApplicableRuleForTicket: (categoryId, priorityId) => 
        axios.post(`${API_URL}/GetApplicableRuleForTicket`, {
            CategoryId: categoryId,
            PriorityId: priorityId
        }),
    
    // Obtener técnicos por especialidad
    GetTechniciansBySpeciality: (specialityId) => 
        axios.get(`${API_URL}/GetTechniciansBySpeciality/${specialityId}`),
    
    // Obtener técnicos por categoría
    GetTechniciansByCategory: (categoryId) => 
        axios.get(`${API_URL}/GetTechniciansByCategory/${categoryId}`),
    
    // Asignar ticket
    AssignTicket: (data) => 
        axios.post(`${API_URL}/AssignTicket`, data),


        UpdateTicket: (data) => 
        axios.patch(`${API_URL}/UpdateTicket`, data),


        InsertsTicket: (data) => 
        axios.post(`${API_URL}/InsertsTicket`, data),


};

export default AutoTriageList;