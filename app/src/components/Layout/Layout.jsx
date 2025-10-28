import React from "react";
import { Sidebar } from './SideBar'; 
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar  /> 
      <main className="flex-1 overflow-auto "> 
         <Header />
       <Outlet />
      </main>
    </div>
  );
}