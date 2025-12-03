import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/NotificationsController';

const Notification = {

InsertNotificationTechnicianFlowTicket: (triggeredUserId, ticketId) =>  axios.patch(`${API_URL}/InsertNotificationTechnicianFlowTicket/${triggeredUserId}/${ticketId}`),
InsertNotificationClienteFlowTicket: (triggeredUserId, ticketId, clientId) => axios.patch(`${API_URL}/InsertNotificationClienteFlowTicket/${triggeredUserId}/${ticketId}/${clientId}`),
 
 InsertNotificationLogIn: (userid) => axios.patch(`${API_URL}/InsertNotificationLogIn/${userid}`),
 GetCountNotificationsByIDUser: (userid) => axios.patch(`${API_URL}/GetCountNotificationsByIDUser/${userid}`),
GetNotificationsByIDUser: (userid) => axios.get(`${API_URL}/GetNotificationsByIDUser/${userid}`),

//updates
 UpdateNotificacionIsRead: (id) => axios.patch(`${API_URL}/UpdateNotificacionIsRead/${id}`),
 UpdateNotificacionAllIsRead: (userid) => axios.patch(`${API_URL}/UpdateNotificacionAllIsRead/${userid}`),


};


export default Notification;
