import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserContext'  
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

import { Toaster } from "react-hot-toast";


import { CreateATicket } from "./components/Pages/CreateATicket"
import MaintainListTechnician from './components/Pages/MaintainListTechnician'
import  MaintainListCategories from './components/Pages/MaintainListCategories'
import  MaintainListTickets from './components/Pages/MaintainListTickets'
import { UpdateTechnician } from "./components/Pages/UpdateTechnician"


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
     { path: '/create-ticket', element: <CreateATicket /> },

    

      //Rutas de mantenimiento

{ path: "/mantenimiento/tecnicos", element: <MaintainListTechnician /> },
 {path: '/mantenimiento/categorías', element: <MaintainListCategories />},
 {path: '/mantenimiento/tickets', element: <MaintainListTickets />},

//create
{ path: "/technicians/create", element: <CreateTechnician/> },
{ path: "/categories/create", element: <CreateCategories/> },
//update
  { path: "/technicians/update/:id", element: <UpdateTechnician/> },








      

     //Error page
      { path: '*', element: <PageNotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> 
      <RouterProvider router={rutas} />
      <Toaster position="top-right" />
    </UserProvider> 
  </StrictMode>,
)
