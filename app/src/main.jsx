import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { LanguageProvider } from './context/LanguageContext'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import { TechnicianList } from './components/Pages/Technicians'
import { DetailTechnician } from './components/Pages/DetailTechnician'
import { Categories } from "./components/Pages/Categories"
import { DetailCategory } from "./components/Pages/DetailCategory"
import { Tickets } from "./components/Pages/Tickets"
import { DetailTicket } from "./components/Pages/DetailTicket"
import { MyTickets } from "./components/Assignments/MyTickets"
import {  CreateTechnician } from "./components/Pages/CreateTechnician"
import {  CreateCategories } from "./components/Pages/CreateCategories" 
import  AutotriagePage  from "./components/Pages/AutotriagePage"

import { Toaster } from "react-hot-toast";


import Login from './components/Pages/User/Login';
import  Register from "./components/Pages/User/Register";

import {  CreateATicket  } from "./components/Pages/CreateATicket"
import MaintainListTechnician from './components/Pages/MaintainListTechnician'
import  MaintainListCategories from './components/Pages/MaintainListCategories'
import  MaintainListTickets from './components/Pages/MaintainListTickets'
import { UpdateTechnician } from "./components/Pages/UpdateTechnician"
import { TrazabilidadTicket } from "./components/Pages/TrazabilidadTicket"
import { Notifications } from "./components/Pages/Notifications"
import { Dashboards } from "./components/Pages/DashboardTickets"

import './Translations/i18n';



// Crear las rutas
const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      //Pagina Principal
      { index: true, element: <Home /> },
     //Rutas de pagina
     { path: '/technicians', element: <TechnicianList /> },
     { path: '/technician/:id', element: <DetailTechnician /> }, 
     { path: '/categories', element: <Categories /> },  
     { path: '/category/:id', element: <DetailCategory /> },
     { path: '/tickets', element: <Tickets /> },
     { path: '/ticket/:id', element: <DetailTicket /> },
     { path: '/my-tickets', element: <MyTickets /> }, 
     {path: '/DashboardTickets', element: <Dashboards />},
     //trazabilidadticket
     { path: '/my-tickets/:id', element: <TrazabilidadTicket /> }, 

      //Autotriage
      {path: '/AutotriagePage', element: <AutotriagePage />},
   
      //login, register
 {path: '/login', element: <Login />},
   
 {path: '/register', element: <Register />},
   

      //Rutas de mantenimiento

{ path: "/mantenimiento/tecnicos", element: <MaintainListTechnician /> },
 {path: '/mantenimiento/categorías', element: <MaintainListCategories />},
 {path: '/mantenimiento/tickets', element: <MaintainListTickets />},

//create
{ path: "/technicians/create", element: <CreateTechnician/> },
{ path: "/categories/create", element: <CreateCategories/> },
{ path: "/tickets/create", element: <CreateATicket/> },

// Editar categoría
{ path: "/category/edit/:id", element: <CreateCategories/> },

//update
{ path: "/technicians/update/:id", element: <UpdateTechnician/> },
//notis
   { path: '/notifications', element: <Notifications /> },





     //Error page
      { path: '*', element: <PageNotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <UserProvider> 
        <RouterProvider router={rutas} />
        <Toaster position="top-right" />
      </UserProvider>
    </LanguageProvider>
  </StrictMode>,
)
