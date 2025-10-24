<?php
class SpecialitiesController
{

    //GETALL
    //http://localhost/Academy-Helpdesk.github.io/api/TicketsController
    public function index()
    {
        try {
            $response = new Response();
            $Specialities = new SpecialitiesModel();
            $result = $Specialities->GetAllSpecialities();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GetByID
    //http://localhost/Academy-Helpdesk.github.io/api/TicketsController/get/1
    public function get($param)
    {
        try {
            $response = new Response();
            $Specialities = new SpecialitiesModel();
            $result = $Specialities->GetSpecialityByCategoryID($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GetAllticketsMin
    //http://localhost/Academy-Helpdesk.github.io/api/GetAllticketsMin/get/1
     public function GetAllticketsMin()
    {
        try {
            $response = new Response();
            $Specialities = new SpecialitiesModel();
            $result = $Specialities->AllticketsMin();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    


}
