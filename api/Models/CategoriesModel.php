<?php
class CategoriesModel  {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    
 public function GetAllCategories() {
    $vSql = "SELECT * FROM categories;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    return $vResultado;
}

public function GetCategoryById($id) {
    $vSql = "SELECT * FROM categories WHERE id = $id;";
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
}

//nombre de la categoria, lista de etiquetas, lista de especialidades y su SLA
public function GetCategoryDetailsByID($id) {
    $vSql = "SELECT Categories.Name AS Categorie, SLA.MinTimeHours AS TiempoMinimo, SLA.MaxTimeHours AS TiempoMaximo, GROUP_CONCAT(DISTINCT Specialities.Speciality SEPARATOR ', ') AS Especielities, GROUP_CONCAT(DISTINCT Tags.Tag SEPARATOR ', ') AS tags           
FROM Categories
JOIN SLA ON Categories.SLAId = SLA.Id
JOIN Specialities ON Specialities.CategoryId = Categories.Id
JOIN Tags ON Tags.CategoryId = Categories.Id
WHERE Categories.Id = $id
";
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
}



}