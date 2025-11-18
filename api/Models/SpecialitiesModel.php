<?php
class SpecialitiesModel  {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


 public function GetAllSpecialities() {
    $vSql = "SELECT Id, CategoryId, Speciality FROM specialities;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    return $vResultado;
 }

 public function GetSpecialityByCategoryID($id) {
    $vSql = "SELECT * FROM specialities WHERE CategoryId = $id;";
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
 }

public function GetAllTags(){
 $vSql = "SELECT Id, CategoryId, Tag from tags;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    return $vResultado;
}


 public function GetSpecialitiesInformationByUserID($id) {
    $vSql = "SELECT 
            s.Id,
            s.Speciality AS Name,
             s.CategoryId,
                c.Name AS CategoryName,
                ts.Active
        FROM technician_specialities ts
       INNER JOIN specialities s ON ts.SpecialityId = s.Id
             INNER JOIN categories c ON s.CategoryId = c.Id
             WHERE ts.UserId = $id";

    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);

    return $vResultado;
    
   }




}