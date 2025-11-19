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
    $vSql = "
        SELECT 
            c.Name AS Categorie,
            c.Descripcion,
            
            sla.MaxTimeResolution AS TiempoMaximoResolucion,
            sla.MaxTimeResponse AS TiempoMaximoRespuesta,
            GROUP_CONCAT(DISTINCT s.Speciality SEPARATOR ', ') AS Especialidades,
            GROUP_CONCAT(DISTINCT t.Tag SEPARATOR ', ') AS Tags
        FROM Categories c
        INNER JOIN SLA sla ON c.SLAId = sla.Id
        LEFT JOIN Category_Specialities cs ON cs.CategoryId = c.Id
        LEFT JOIN Specialities s ON s.Id = cs.SpecialityId
        LEFT JOIN Category_Tags ct ON ct.CategoryId = c.Id
        LEFT JOIN Tags t ON t.Id = ct.TagId     
        WHERE c.Id = $id
        GROUP BY 
            c.Name, 
            c.Descripcion,
            sla.MaxTimeResolution,
            sla.MaxTimeResponse
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

      
        $name = isset($data->Name) ? addslashes($data->Name) : '';
        $descripcion = isset($data->Descripcion) ? addslashes($data->Descripcion) : '';

        $sql = "INSERT INTO Categories (Name, SLAId, Descripcion, Active) 
                VALUES ('$name', $slaId, '$descripcion', 1);";
    
      
        $categoryId = $this->enlace->executeSQL_DML_last($sql);

     
        if ($categoryId && $categoryId > 0) {
    
            if (isset($data->Tags) && is_array($data->Tags)) {
                foreach ($data->Tags as $tagId) {
                    $tagId = intval($tagId);
                    $sqlTag = "INSERT INTO Category_Tags (CategoryId, TagId) VALUES ($categoryId, $tagId);";
                    $this->enlace->executeSQL_DML($sqlTag);
                }
            }

       
            if (isset($data->Specialities) && is_array($data->Specialities)) {
                foreach ($data->Specialities as $specId) {
                    $specId = intval($specId);
                    $sqlSpec = "INSERT INTO Category_Specialities (CategoryId, SpecialityId) VALUES ($categoryId, $specId);";
                    $this->enlace->executeSQL_DML($sqlSpec);
                }
            }

            return [
                "success" => true,
                "message" => "Categoría creada correctamente",
                "Id" => $categoryId
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo crear la categoría"
        ];

  }

}