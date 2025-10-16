<?php
class TechModel {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function GetAllTechnicians() {

        $Role = "technical";

        $vSql = "SELECT * FROM users WHERE roles = '$Role';";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado;
    }


    public function GetDetailById($id) { }

    public function GetUserName($id){}
    public function GetMail($id){}
    public function State($id){}
    public function GetAllSpecialitysbyId($id){}
    public function GetInstitution($id){}
    public function GetWorkCharge($id){}
    public function GetInsuranceType($id){}
}
