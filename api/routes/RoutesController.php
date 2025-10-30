<?php
class RoutesController
{
    private $authMiddleware;
    private $protectedRoutes = [];

    public function __construct()
    {

        $this->routes();
    }

    private function registerRoutes()
    {
        
        $this->addProtectedRoute('GET', '/apimovie/actor', 'actor', 'index', ['Administrador']);
    }

    public function routes()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = strtolower($_SERVER['REQUEST_URI']);

   
        if ($this->isProtectedRoute($method, $path)) {
            $route = $this->protectedRoutes["$method:$path"];
       
            if (!$this->authMiddleware->handle($route['requiredRole'])) {
                return;
            }
        }
    }

    private function addProtectedRoute($method, $path, $controllerName, $action, $requiredRole)
    {
        $this->protectedRoutes["$method:$path"] = [
            'controller' => $controllerName,
            'action' => $action,
            'requiredRole' => $requiredRole
        ];
    }

    private function isProtectedRoute($method, $path)
    {
        return isset($this->protectedRoutes["$method:$path"]);
    }
    
    public function index()
    {
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        $baseFolder = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');

      
        if ($baseFolder !== '/' && stripos($requestUri, $baseFolder) === 0) {
            $requestUri = substr($requestUri, strlen($baseFolder));
        }

        $routesArray = explode("/", trim($requestUri, "/"));


        if (isset($routesArray[0]) && $routesArray[0] === 'uploads') {
            $filePath = __DIR__ . '/' . implode("/", $routesArray);
            if (file_exists($filePath)) {
                header('Content-Type: ' . mime_content_type($filePath));
                readfile($filePath);
                exit;
            } else {
                http_response_code(404);
                echo 'Archivo no encontrado.';
                return;
            }
        }

 
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

   
        if (empty($routesArray[0])) {
            $json = [
                "success" => false,
                "status"  => 404,
                "message" => 'Controlador no especificado'
            ];
            echo json_encode($json, http_response_code($json["status"]));
            return;
        }

        $controller = $routesArray[0] ?? null;
        $action     = $routesArray[1] ?? null;
        $param1     = $routesArray[2] ?? null;
        $param2     = $routesArray[3] ?? null;
        $param3     = $routesArray[4] ?? null;
        
 

        try {
            if ($controller && class_exists($controller)) {
                $response = new $controller();

                switch ($_SERVER['REQUEST_METHOD']) {
                    case 'GET':
                        if ($action && is_numeric($action)) {
                       
                            $response->get($action);
                        } elseif ($action && method_exists($response, $action)) {
                       
                            if ($param1 && $param2 && $param3) {
                               
                                $response->$action($param1, $param2, $param3);
                            } elseif ($param1 && $param2) {
                             
                                $response->$action($param1, $param2);
                            } elseif ($param1) {
                            
                                $response->$action($param1);
                            } else {
                            
                                $response->$action();
                            }
                        } elseif (!$action) {
                        
                            $response->index();
                        } else {
                            $json = [
                                "success" => false,
                                "status"  => 404,
                                "message" => 'Acción no encontrada'
                            ];
                            echo json_encode($json, http_response_code($json["status"]));
                        }
                        break;

                    case 'POST':
                        if ($action && method_exists($response, $action)) {
                            $response->$action();
                        } else {
                            $response->create();
                        }
                        break;

                    case 'PUT':
                    case 'PATCH':
                        if ($param1) {
                            $response->update($param1);
                        } elseif ($action && method_exists($response, $action)) {
                            $response->$action();
                        } else {
                            $response->update();
                        }
                        break;

                    case 'DELETE':
                        if ($param1) {
                            $response->delete($param1);
                        } elseif ($action && method_exists($response, $action)) {
                            $response->$action();
                        } else {
                            $response->delete();
                        }
                        break;

                    default:
                        $json = [
                            "success" => false,
                            "status"  => 405,
                            "message" => 'Método HTTP no permitido'
                        ];
                        echo json_encode($json, http_response_code($json["status"]));
                        break;
                }
            } else {
                $json = [
                    "success" => false,
                    "status"  => 404,
                    "message" => 'Controlador no encontrado'
                ];
                echo json_encode($json, http_response_code($json["status"]));
            }
        } catch (\Throwable $th) {
            $json = ['status' => 500, 'result' => $th->getMessage()];
            echo json_encode($json, http_response_code($json["status"]));
        }
    }
}