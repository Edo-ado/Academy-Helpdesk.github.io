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


    public function CreateSLA($param, $param2){
        try {
            $response = new Response();
            $SLA = new SLAModel();
            $result = $SLA->CreateSLA($param, $param2  );
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        } 
    }


}