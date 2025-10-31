// src/Services/TicketsLists.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/TicketsController';

const TicketsLists = {
 
  getAllTicketsMin: () => axios.get(`${API_URL}/GetAllticketsMin`),
  getTicketsAssignedToTechnician: (technicianId) =>  axios.get(`${API_URL}/TicketAssignedToTEC/${technicianId}`),
  getTicketsPerUser: (userId) =>  axios.get(`${API_URL}/TicketsPerUser/${userId}`),
  GetTicketById: (id) => axios.get(`${API_URL}/GetTicketById/${id}`),
GetDailyAssignments: (date, technicianId) => axios.get(`${API_URL}/GetDailyAssignments/${date}/${technicianId}`),


};

export default TicketsLists;
