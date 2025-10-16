<?php
class UserController
{
    public function index()
    {
        try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET TECHNICIANS
    //http://localhost/Academy-Helpdesk.github.io/api/UserController/getTechnician/
    public function getTechnician()
    {
      try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->GetAllTechnicians();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET TECHNICIAN DETAIL BY ID
    //http://localhost/Academy-Helpdesk.github.io/api/UserController/getDetailById/1
    public function getDetailById($id)
    {
      try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->GetDetailById($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



    
}


