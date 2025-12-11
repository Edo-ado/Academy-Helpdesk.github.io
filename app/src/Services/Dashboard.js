import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/DashboardController';

const Dashboard = {
   TicketsPerMonth: () => axios.get(`${API_URL}/TicketsPerMonth`),
   CantTicketsPerState: () => axios.get(`${API_URL}/CantTicketsPerState`),
   PromedioValoraciones: () => axios.get(`${API_URL}/PromedioValoraciones`),
   CategoriasConInco: () => axios.get(`${API_URL}/CategoriasConInco`),
   RankingTechByCump: () => axios.get(`${API_URL}/RankingTechByCump`),
};

export default Dashboard;
