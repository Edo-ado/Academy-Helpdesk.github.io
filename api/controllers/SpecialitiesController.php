<?php
class SpecialitiesController
{

    //GETALL
    //http://localhost/Academy-Helpdesk.github.io/api/SpecialitiesController/GetAll
    public function GetAll()
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
    //http://localhost/Academy-Helpdesk.github.io/api/SpecialitiesController/getById/1
    public function getById($param)
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
