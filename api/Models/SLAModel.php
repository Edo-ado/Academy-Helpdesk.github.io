<?php
class SLAModel  {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    
 public function GetAllSLAs() {
    $vSql = "SELECT * FROM sla;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    return $vResultado;
 }

 public function GetSLABYId($id) {
    $vSql = "SELECT * FROM sla WHERE id = $id;";
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
 }


}