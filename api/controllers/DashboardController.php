<?php
class DashboardController
{


public function TicketsPerMonth(){

    try {
            $response = new Response();
            $Dashboards = new dashboardModel();
            $result = $Dashboards->TicketsPerMonth();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
}

public function CantTicketsPerState(){
    try {
            $response = new Response();
            $Dashboards = new dashboardModel();
            $result = $Dashboards->CantTicketsPerState();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }



    }

    public function PromedioValoraciones()  {
        try {
            $response = new Response();
            $Dashboards = new dashboardModel();
            $result = $Dashboards->PromedioValoraciones();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
        
    }

    
    public function CategoriasConInco()  {
        try {
            $response = new Response();
            $Dashboards = new dashboardModel();
            $result = $Dashboards->CategoriasConInco();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
        
    }

    public function RankingTechByCump()  {
        try {
            $response = new Response();
            $Dashboards = new dashboardModel();
            $result = $Dashboards->RankingTechByCump();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
        
    }






}