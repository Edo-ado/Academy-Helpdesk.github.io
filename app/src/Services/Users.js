import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/UserController';


const Users = {
  GetAllUsers: () => axios.get(`${API_URL}/GetAllUsers`),
  GetUsersById: (id) => axios.get(`${API_URL}/GetUserById/${id}`),

};
export default Users;
