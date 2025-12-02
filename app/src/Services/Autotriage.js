// src/services/AutoTriageList.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController';

const AutoTriageList = {
    // Obtener todas las reglas de AutoTriage
    getAllAutoTriageRules: () => axios.get(`${API_URL}`),
    
    // Obtener todas las reglas activas
    GetAllAutoTriageRulesActive: () => axios.get(`${API_URL}/GetAllAutoTriageRulesActive`),
    
    // Obtener regla por ID
    GetAutoTriageRuleById: (id) => axios.get(`${API_URL}/get/${id}`),
    
    // Obtener detalles completos de una regla
    GetAutoTriageRuleDetailsByID: (id) => axios.get(`${API_URL}/details/${id}`),
    
    // Actualizar regla de AutoTriage
    UpdateAutoTriageRuleById: (id, data) => axios.put(`${API_URL}/UpdateAutoTriageRuleById/${id}`, data),
    
    // Crear nueva regla de AutoTriage
    CreateAutoTriageRule: (data) => 
        axios.post(`${API_URL}/CreateAutoTriageRule`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        }),
    
    // Desactivar regla de AutoTriage
    DeleteAutoTriageRule: (id) => axios.patch(`${API_URL}/DeleteAutoTriageRule/${id}`),
    
    // Activar regla de AutoTriage
    ActivateAutoTriageRule: (id) => axios.patch(`${API_URL}/ActivateAutoTriageRule/${id}`),
    
    // Obtener tickets pendientes para asignación automática
    GetPendingTicketsForAutoTriage: () => axios.get(`${API_URL}/GetPendingTicketsForAutoTriage`),
    
    // Obtener técnicos por especialidad
    GetTechniciansBySpeciality: (specialityId) => axios.get(`${API_URL}/GetTechniciansBySpeciality/${specialityId}`),
    
    // Obtener regla aplicable para un ticket específico
    GetApplicableRuleForTicket: (categoryId, priorityId) => 
        axios.get(`${API_URL}/GetApplicableRuleForTicket/${categoryId}/${priorityId}`),
    
    // Asignar ticket a técnico (automático)
    AssignTicketToTechnician: (data) => 
        axios.post(`${API_URL}/AssignTicketToTechnician`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        }),
    
    // Asignación manual de ticket
    ManualAssignTicket: (data) => 
        axios.post(`${API_URL}/ManualAssignTicket`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        }),
    
    // Obtener información para asignación manual
    GetManualAssignmentInfo: (ticketId) => axios.get(`${API_URL}/GetManualAssignmentInfo/${ticketId}`),
    
    // Obtener todos los técnicos con su carga de trabajo
    GetAllTechniciansWithWorkload: () => axios.get(`${API_URL}/GetAllTechniciansWithWorkload`),
};

export default AutoTriageList;