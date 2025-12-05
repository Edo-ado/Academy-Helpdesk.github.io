// src/Services/TicketsLists.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/TicketsController';
const API_URL_TICKETMAINTAIN = 'http://localhost/Academy-Helpdesk.github.io/api/CreateTicketController';

const TicketsLists = {
 
  getAllTicketsMin: () => axios.get(`${API_URL}/GetAllticketsMin`),
  getTicketsAssignedToTechnician: (technicianId) =>  axios.get(`${API_URL}/TicketAssignedToTEC/${technicianId}`),
  getTicketsPerUser: (userId) =>  axios.get(`${API_URL}/TicketsPerUser/${userId}`),
  GetTicketById: (id) => axios.get(`${API_URL}/GetTicketById/${id}`),
  GetDailyAssignments: (date, technicianId) => axios.get(`${API_URL}/GetDailyAssignments/${date}/${technicianId}`),
  GetWeeklyAssignments: (weekStartDate, technicianId) => axios.get(`${API_URL}/GetWeeklyAssignments/${weekStartDate}/${technicianId}`),
  getHistoryByTicket: (id) => axios.get(`${API_URL}/getHistoryByTicket/${id}`),
  TicketsByRolAndIDUser: (id) => axios.get(`${API_URL}/TicketsByRolAndIDUser/${id}`),
  GetHoraFecha:  () => axios.get(`${API_URL}/GetHoraFecha`),
  ChangeState: (payload) => axios.post(`${API_URL}/ChangeState`, payload),
  //del otro lao
  getAllPriorities: () => axios.get(`${API_URL_TICKETMAINTAIN}/getAllPriorities`),
  getCategoriesByTags: (id) =>  axios.get(`${API_URL_TICKETMAINTAIN}/getCategoriesByTags/${id}`),
  createticket: (data) => axios.post(`${API_URL_TICKETMAINTAIN}/createticket`,data)


};

export default TicketsLists;
