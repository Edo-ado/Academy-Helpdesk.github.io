<?php
class CategoriesModel
{

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


    public function GetAllCategoriesListActive()
    {
        $vSql = "SELECT * FROM categories c where c.Active =1 ORDER BY id desc;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }


    public function GetAllCategories()
    {
        $vSql = "SELECT * FROM categories  ORDER BY id desc;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    public function GetCategoryById($id)
{
    $sql = "SELECT * FROM categories WHERE id = $id;";
    
    // Aquí SÍ usamos correctamente ExecuteSQL
    $result = $this->enlace->executeSQL($sql, "asoc");

    return $result;
}


    //nombre de la categoria, lista de etiquetas, lista de especialidades y su SLA
    public function GetCategoryDetailsByID($id)
    {
        $vSql = "SELECT Categories.Name AS Categorie, SLA.MaxTimeResolution AS TiempoMaximoResolucion, SLA.MaxTimeResponse AS TiempoMaximoRespuesta, GROUP_CONCAT(DISTINCT Specialities.Speciality SEPARATOR ', ') AS Especielities, GROUP_CONCAT(DISTINCT Tags.Tag SEPARATOR ', ') AS tags           
FROM Categories
JOIN SLA ON Categories.SLAId = SLA.Id
JOIN Specialities ON Specialities.CategoryId = Categories.Id
JOIN Tags ON Tags.CategoryId = Categories.Id
WHERE Categories.Id = $id
";
        $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
        return $vResultado;
    }



    //sin probar
    public function UpdateCategoryByid($id, $arrayData, $slaId)
    {

        $sql = "UPDATE categories SET Name = $arrayData.Name, SLAId = $slaId, Descripcion = $arrayData.Descripcion WHERE id = $id;";

        $sqlresult = $this->enlace->ExecuteSQL($sql, [$id]);


        return $sqlresult;


    }

    // en proceso 
public function DeleteCategory($id)
{
    $sql = "UPDATE categories SET Active = 0 WHERE id = $id;";
    return $this->enlace->executeSQL_DML($sql);
}

public function ActivateCategory($id){
    $sql = "UPDATE categories SET Active = 1  WHERE id = $id"; 
    return $this->enlace->executeSQL_DML($sql);
}

    
    //sin probar
public function CreateCategory($data)
{
   
    
   
        $slaId = intval($data->SLAId);
                $sql = "INSERT INTO Categories (Name, SLAId, Descripcion, Active) 
                VALUES ('$data->Name', $slaId, '$data->Descripcion', 1)";
        
    
            return  $this->enlace->executeSQL_DML($sql);


 
        }

}