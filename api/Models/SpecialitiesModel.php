<?php
class SpecialitiesModel  {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


 public function GetAllSpecialities() {
    $vSql = "SELECT Id, Speciality FROM specialities;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    return $vResultado;
 }

 public function GetSpecialityByCategoryID($id) {
    $vSql = "SELECT * FROM specialities WHERE CategoryId = $id;";
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
 }

public function GetAllTags(){
 $vSql = "SELECT Id, Tag from tags;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    return $vResultado;
}
public function GetSpecialitiesInformationByUserID($id) {
    $vSql = "SELECT 
                s.Id,
                s.Speciality AS Name,
                c.Id AS CategoryId,
                c.Name AS CategoryName,
                ts.Active
            FROM technician_specialities ts
            INNER JOIN specialities s ON ts.SpecialityId = s.Id
            LEFT JOIN category_specialities cs ON cs.SpecialityId = s.Id
            LEFT JOIN categories c ON cs.CategoryId = c.Id
            WHERE ts.UserId = $id";

    return $this->enlace->ExecuteSQL($vSql, [$id]);
}





}