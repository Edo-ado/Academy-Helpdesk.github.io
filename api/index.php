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
require_once "Models/UserModel.php";
require_once "Models/CategoriesModel.php";
require_once "Models/SLAModel.php";
require_once "Models/SpecialitiesModel.php";
require_once "Models/TicketsModel.php";
require_once "Models/CreateTicketModel.php";
require_once "Models/AutoTriageModel.php";
require_once "Models/ImageModel.php";
require_once "Models/NotificationsModel.php";
require_once "Models/UserModelRegister.php";


/***--- Agregar todos los controladores*/
require_once "controllers/UserController.php";
require_once "controllers/CategoriesController.php";
require_once "controllers/SLAController.php";
require_once "controllers/SpecialitiesController.php";
require_once "controllers/TicketsController.php";
require_once "controllers/CreateTicketController.php";
require_once "controllers/ImageController.php";
require_once "controllers/AutoTriageController.php";
require_once "controllers/NotificationsController.php";
require_once "controllers/UserRegisterController.php";

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();



