<?php
class CategoriesController
{

    //GETALL
    //http://localhost/Academy-Helpdesk.github.io/api/CategoriesController
    public function index()
    {
        try {
            $response = new Response();
            $Categories = new CategoriesModel();
            $result = $Categories->GetAllCategories();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GetByID
    //http://localhost/Academy-Helpdesk.github.io/api/CategoriesController/get/1
    public function get($param)
    {
        try {
            $response = new Response();
            $Categories = new CategoriesModel();
            $result = $Categories->GetCategoryById($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GetDetails
    //http://localhost/Academy-Helpdesk.github.io/api/CategoriesController/details/1
    public function details($param)
    {
        try {
            $response = new Response();
            $Categories = new CategoriesModel();
            $result = $Categories->GetCategoryDetailsByID($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



}
