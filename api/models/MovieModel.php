<?php
class MovieModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar peliculas
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        //Consulta SQL
        $vSQL = "SELECT * FROM movie order by title desc;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        //Retornar la respuesta
        return $vResultado;
    }
    /**
     * Obtener una pelicula
     * @param $id de la pelicula
     * @return $vresultado - Objeto pelicula
     */
    //
    public function get($id)
    {
        $directorM = new DirectorModel();
        $genreM = new GenreModel();
        $actorM = new ActorModel();
        $imagenM = new ImageModel();
        $vSql = "SELECT * FROM movie
                    where id=$id;";

        //Ejecutar la consulta sql
        $vResultado = $this->enlace->executeSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
            //Imagenes
            $vResultado->imagen = $imagenM->getImageMovie(($vResultado->id));
            //Director
            $director = $directorM->get($vResultado->director_id);
            $vResultado->director = $director;
            //Generos --genres
            $listaGeneros = $genreM->getGenreMovie($vResultado->id);
            $vResultado->genres = $listaGeneros;
            //Actores --actors
            $listaActores = $actorM->getActorMovie($id);
            $vResultado->actors = $listaActores;
        }

        //Retornar la respuesta
        return $vResultado;
    }


    public function inventario()
{
    // Consulta con INNER JOIN
    $vSQL = "SELECT m.id, m.title, i.price
             FROM movie m
             INNER JOIN inventory i ON m.id = i.movie_id
             ORDER BY m.title ASC;";

    // Ejecutar la consulta
    $vResultado = $this->enlace->executeSQL($vSQL);

    // Retornar el resultado
    return $vResultado;
}
}
