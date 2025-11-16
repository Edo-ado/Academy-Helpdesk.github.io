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


    public function UpdateCategoryByid($param, $param2, $param3)
    {
        try {
            $response = new Response();
            $Categories = new CategoriesModel();
            $result = $Categories->UpdateCategoryByid($param, $param2, $param3);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function GetCategoryById($id){
        try {
            $response = new Response();
            $Categories = new CategoriesModel();
            $result = $Categories->GetCategoryById($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        } 
    }

    //http://localhost/Academy-Helpdesk.github.io/api/CategoriesController/DeleteCategory/1
    public function DeleteCategory($param)
    {
        try {
            $response = new Response();
            $Categories = new CategoriesModel();
            $result = $Categories->DeleteCategory($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



    public function ActivateCategory($param){
          try {
            $response = new Response();
            $Categories = new CategoriesModel();
            $result = $Categories->ActivateCategory($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //http://localhost/Academy-Helpdesk.github.io/api/CategoriesController/createCategory
    public function createCategory($data)
    {
        try {
            $response = new Response();
            $Categories = new CategoriesModel();
            $result = $Categories->CreateCategory($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



}
