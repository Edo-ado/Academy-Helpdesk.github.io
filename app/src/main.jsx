import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import { TechnicianList } from './components/Pages/Technicians'
import { DetailTechnician } from './components/Pages/DetailTechnician'

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

     //Error page
      { path: '*', element: <PageNotFound /> },
    
      
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)