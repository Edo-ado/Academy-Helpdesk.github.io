<?php
class UserController
{

    //GET TECHNICIANS
    //http://localhost/Academy-Helpdesk.github.io/api/UserController/GetAllTechnicians/
    public function GetAllTechnicians()
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

     public function GetAllTechniciansListActive()
    {
        try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->GetAllTechniciansListActive();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET TECHNICIAN DETAIL BY ID
    //http://localhost/Academy-Helpdesk.github.io/api/UserController/GetDetailByIdAll/1
    public function GetDetailByIdAll($id)
    {
        try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->GetDetailByIdAll($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function GetDetailTechnicianById($id)
    {
        try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->GetDetailTechnicianById($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



    //GET Users
    //http://localhost/Academy-Helpdesk.github.io/api/UserController/GetAllUsers/
    public function GetAllUsers()
    {
        try {
            $response = new Response();
            $Usuario = new UserModel();
            $result = $Usuario->GetAllUsers();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function GetUsersById($id)
    {

        try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->GetAllUsers();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();
        $Tecnico = new UserModel();
        $result = $Tecnico->create($inputJSON);
        //Dar respuesta
        $response->toJSON($result);
    }




    public function update()
    {
        try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->update();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    //GET Seguros
    //http://localhost/Academy-Helpdesk.github.io/api/UserController/GetSeguros/
    public function GetSeguros()
    {
        try {
            $response = new Response();
            $Usuario = new UserModel();
            $result = $Usuario->GetSeguros();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function DeleteUsers($id)
    {
        try {
            $response = new Response();
            $Usuario = new UserModel();
            $result = $Usuario->DeleteUsers($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }

    }

public function ActivateUser($id){
     try {
            $response = new Response();
            $Usuario = new UserModel();
            $result = $Usuario->ActivateUser($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
}

}






