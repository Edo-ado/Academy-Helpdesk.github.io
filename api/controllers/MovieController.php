<?php
class movie
{
    // GET listar
    // localhost:81/appmovie/api/movie
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $movieM = new MovieModel;
            //Método del modelo
            $result = $movieM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //GET Obtener 
    // localhost:81/appmovie/api/movie/1
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new MovieModel();
            //Acción del modelo a ejecutar
            $result = $movie->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }


    // GET Inventario
// localhost:81/appmovie/api/movie/inventario
public function inventario()
{
    try {
        $response = new Response();
        // Instancia del modelo
        $movieM = new MovieModel(); 
        // Acción del modelo a ejecutar
        $result = $movieM->inventario();
        // Dar respuesta
        $response->toJSON($result);
    } catch (Exception $e) {
        $response->toJSON(null, false, 500, "Error al obtener inventario");
        handleException($e);
    }
}

}
