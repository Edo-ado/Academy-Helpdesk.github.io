<?php
class ActorModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM actor;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener */
    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM actor where id=$id";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado[0];
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener los actores de una pelicula */
    public function getActorMovie($idMovie)
    {
        try {
            //Consulta SQL
            $vSQL = "SELECT g.id, g.fname, g.lname, mg.role".
            " FROM actor g, movie_cast mg".
            " where g.id=mg.actor_id and mg.movie_id=$idMovie;";            
            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSQL);
            //Retornar el resultado
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /*Obtener iformacion de un actore en especifico */
   public function getMoviesByActor($actorId)
{
    try {
        $vSQL = "SELECT m.id, m.title, m.year, m.time, m.director_id, m.lang
                 FROM movie m, movie_cast mc
                 WHERE m.id = mc.movie_id
                   AND mc.actor_id = $actorId;";
        $vResultado = $this->enlace->executeSQL($vSQL);
        return $vResultado;
    } catch (Exception $e) {
        handleException($e);
    }
}


}
