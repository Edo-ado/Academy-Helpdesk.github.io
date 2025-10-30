<?php
class TicketsController
{

    //GETALL
    //http://localhost/Academy-Helpdesk.github.io/api/TicketsController



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



      public function WeeklyPartialTicketsFilter($id, $first_day, $last_day)
    {

        try {
            $response = new Response();
            $Tickets = new TicketsModel();
            $result = $Tickets->WeeklyPartialTechTicketsFilter($id, $first_day, $last_day);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }

    }

}
