<?php
class actor
{
    // GET Obtener info de un actor 
    // localhost:81/appmovie/api/actor/2
   public function get($id)
{
    try {
        $response = new Response();
        $actorM = new ActorModel();

        // 1. Info del actor
        $actor = $actorM->get($id);

        if ($actor) {
            // 2. Películas del actor
            $peliculas = $actorM->getMoviesByActor($id);

            // 3. Agregar al objeto actor
            $actor->movies = $peliculas;
        }

        // 4. Respuesta
        $response->toJSON($actor);
    } catch (Exception $e) {
        $response->toJSON(null, false, 500, "Error al obtener actor");
        handleException($e);
    }
}
}
