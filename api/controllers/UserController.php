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
    public function GetUsersById($id)    {

          try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->GetAllUsers();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function create(){
        try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->create();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function update(){
        try {
            $response = new Response();
            $Tecnico = new UserModel();
            $result = $Tecnico->update();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

}


