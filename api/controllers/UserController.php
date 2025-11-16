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
public function create()
{
    try {
        $input = file_get_contents("php://input");
        $objeto = json_decode($input);

        // ⬇ Agregar esto temporalmente ⬇
        error_log("📌 DATA RECIBIDA: " . print_r($objeto, true));

        $Tecnico = new UserModel();
        $result = $Tecnico->create($objeto);

        echo json_encode([
            "status" => 200,
            "data" => $result,
            "message" => "Técnico creado correctamente"
        ]);

    } catch (Exception $e) {
        error_log("❌ ERROR CREATE USER: " . $e->getMessage());

        echo json_encode([
            "status" => 500,
            "error" => $e->getMessage()
        ]);
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

}


