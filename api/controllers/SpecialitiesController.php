<?php
class SpecialitiesController
{

    //GETALL
    //http://localhost/Academy-Helpdesk.github.io/api/SpecialitiesController
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
    //http://localhost/Academy-Helpdesk.github.io/api/SpecialitiesController/get/1
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

    


}
