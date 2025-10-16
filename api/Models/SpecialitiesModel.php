<?php
class SpecialitiesModel  {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


 public function GetAllSpecialities() {
    $vSql = "SELECT * FROM specialities;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    return $vResultado;
 }

 public function GetSpecialityByCategoryID($id) {
    $vSql = "SELECT * FROM specialities WHERE CategoryId = $id;";
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
 }


}