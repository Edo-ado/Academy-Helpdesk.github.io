<?php
class SLAController
{

    //GETALL
    //http://localhost/Academy-Helpdesk.github.io/api/SLAController
    public function index()
    {
        try {
            $response = new Response();
            $SLA = new SLAModel();
            $result = $SLA->GetAllSLAs();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GetByID
    //http://localhost/Academy-Helpdesk.github.io/api/SLAController/get/1
    public function get($param)
    {
        try {
            $response = new Response();
            $SLA = new SLAModel();
            $result = $SLA->GetSLABYId($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function CreateSLA(){
       $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();
        $Tecnico = new SLAModel();
        $result = $Tecnico->CreateSLA($inputJSON);
        //Dar respuesta
        $response->toJSON($result);
    }


}