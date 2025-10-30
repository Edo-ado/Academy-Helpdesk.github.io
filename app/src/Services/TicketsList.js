// src/Services/TicketsLists.js
import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/TicketsController';

const TicketsLists = {
 
  getAllTicketsMin: () => axios.get(`${API_URL}/GetAllticketsMin`),
  getTicketsAssignedToTechnician: (technicianId) =>  axios.get(`${API_URL}/TicketAssignedToTEC/${technicianId}`),
  getTicketsPerUser: (userId) =>  axios.get(`${API_URL}/TicketsPerUser/${userId}`),
  GetTicketById: (id) => axios.get(`${API_URL}/GetTicketById/${id}`),
  WeeklyPartialTechTicketsFilter: (technicianId, startDate, endDate) => axios.get(`${API_URL}/WeeklyPartialTechTicketsFilter/${technicianId}/${startDate}/${endDate}`),
  WeeklyPartialUserTicketsFilter: (userId, startDate, endDate) => axios.get(`${API_URL}/WeeklyPartialUserTicketsFilter/${userId}/${startDate}/${endDate}`),
};

export default TicketsLists;
