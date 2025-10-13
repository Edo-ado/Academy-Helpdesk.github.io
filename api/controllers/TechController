<?php
class TechController
{
    public function index()
    {
        try {
            $response = new Response();
            $Tecnico = new TechModel();
            $result = $Tecnico->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($param)
    {
        try {
            $response = new Response();
            $Tecnico = new TechModel();
            $result = $Tecnico->get($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}


