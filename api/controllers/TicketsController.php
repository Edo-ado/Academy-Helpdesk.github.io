<?php
class TicketsController
{

    //GetAllticketsMin
    //http://localhost/Academy-Helpdesk.github.io/api/TicketsController/GetAllticketsMin
    public function GetAllticketsMin()
    {
        try {
            $response = new Response();
            $Tickets = new TicketsModel();
            $result = $Tickets->AllticketsMin();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



    //TicketAssignedToTEC
    //http://localhost/Academy-Helpdesk.github.io/api/TicketsController/TicketAssignedToTEC/1
    public function TicketAssignedToTEC($param)
    {
        try {
            $response = new Response();
            $Tickets = new TicketsModel();
            $result = $Tickets->TicketAssignedToTEC($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    //TicketsPerUser
    //http://localhost/Academy-Helpdesk.github.io/api/TicketsController/TicketsPerUser/1

    public function TicketsPerUser($param)
    {
        try {
            $response = new Response();
            $Tickets = new TicketsModel();
            $result = $Tickets->TicketsPerUser($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GetTicketById
    //http://localhost/Academy-Helpdesk.github.io/api/TicketsController/GetTicketById/1
    public function GetTicketById($id)
    {
        try {
            $response = new Response();
            $Tickets = new TicketsModel();
            $result = $Tickets->GetTicketById($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //http://localhost/Academy-Helpdesk.github.io/api/TicketsController/GetTicketHistory/28

    public function GetTicketHistory($id){
        try {
            $response = new Response();
            $Tickets = new TicketsModel();
            $result = $Tickets->GetTicketHistory($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function GetDailyAssignments($param1, $param2){
       try {
            $response = new Response();
            $Tickets = new TicketsModel();
            $result = $Tickets->GetDailyAssignments($param1, $param2);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        } 
    }


  public function GetWeeklyAssignments($param1, $param2){
       try {
            $response = new Response();
            $Tickets = new TicketsModel();
            $result = $Tickets->GetWeeklyAssignments($param1, $param2);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        } 
    }


    public function TicketsByRolAndIDUser($id){
         try {
                $response = new Response();
                $Tickets = new TicketsModel();
                $result = $Tickets->TicketsByRolAndIDUser($id);
                $response->toJSON($result);
          } catch (Exception $e) {
                handleException($e);
          }
        
    }



}
