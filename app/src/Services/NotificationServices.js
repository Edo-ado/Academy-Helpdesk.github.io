import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/NotificationsController';

const Notification = {

InsertNotificationTechnicianFlowTicket: (triggeredUserId, ticketId, LastStateTicket, ActualStateTicket) =>  axios.post(`${API_URL}/InsertNotificationTechnicianFlowTicket`, {   triggeredUserId,  ticketId,  LastStateTicket,    ActualStateTicket }),
InsertNotificationAssignTicketTechnician: (triggeredUserId, ticketId) =>  axios.patch(`${API_URL}/InsertNotificationAssignTicketTechnician/${triggeredUserId}/${ticketId}`),

 InsertNotificationClienteFlowTicket: (triggeredUserId, ticketId, clientId, LastStateTicket, ActualStateTicket) =>   axios.post(`${API_URL}/InsertNotificationClienteFlowTicket`, {
   triggeredUserId, ticketId, clientId, LastStateTicket,  ActualStateTicket   }),

 InsertNotificationLogIn: (userid) => axios.patch(`${API_URL}/InsertNotificationLogIn/${userid}`),
 GetCountNotificationsByIDUser: (userid) => axios.get(`${API_URL}/GetCountNotificationsByIDUser/${userid}`),
 GetNotificationsByIDUser: (userid) => axios.get(`${API_URL}/GetNotificationsByIDUser/${userid}`),
 GetNotificationWithTicketById: (notificationId) => axios.get(`${API_URL}/GetNotificationWithTicketById/${notificationId}`),

//updates
 UpdateNotificacionIsRead: (id) => axios.patch(`${API_URL}/UpdateNotificacionIsRead/${id}`),
 UpdateNotificacionAllIsRead: (userid) => axios.patch(`${API_URL}/UpdateNotificacionAllIsRead/${userid}`),


};


export default Notification;
