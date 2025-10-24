<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";

//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/UserModel.php";
require_once "models/CategoriesModel.php";
require_once "models/SLAModel.php";
require_once "models/SpecialitiesModel.php";
require_once "models/TicketsModel.php";

/***--- Agregar todos los controladores*/
require_once "controllers/UserController.php";
require_once "controllers/CategoriesController.php";
require_once "controllers/SLAController.php";
require_once "controllers/SpecialitiesController.php";
require_once "controllers/TicketsController.php";


//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();



