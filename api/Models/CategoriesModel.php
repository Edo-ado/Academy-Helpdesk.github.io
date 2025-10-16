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
    $vSql = "SELECT Categories.Name, SLA.MinTimeHours,SLA.MaxTimeHours, Specialities.Speciality FROM Categories LEFT JOIN SLA ON Categories.SLAId = SLA.Id
LEFT JOIN Specialities ON Specialities.CategoryId = Categories.Id WHERE Categories.Id = $id;";
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
}



}