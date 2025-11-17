<?php
class SLAModel  {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    
 public function GetAllSLAs() {
    $vSql = "SELECT * FROM sla where Active=1;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    return $vResultado;
 }

 public function GetSLABYId($id) {
    $vSql = "SELECT * FROM sla WHERE id = $id;";
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
 }


 public function CreateSLA($MaxTimeResponse, $MaxTimeResolution) {
    $vSql = "INSERT INTO sla ( MaxTimeResponse, MaxTimeResolution, Active) VALUES ( $MaxTimeResponse, $MaxTimeResolution, 1);";
    $vResultado = $this->enlace->executeSQL_DML($vSql);
    return $vResultado;
 }


}