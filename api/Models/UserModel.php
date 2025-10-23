<?php
class UserModel {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function GetAllTechnicians() {
        $Role = "Technician";
        $vSql = "SELECT * FROM users WHERE roleID = 1;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    public function GetDetailByIdList($id) {
        $vSql = "Select Username";

        $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
        return $vResultado;
     }

      public function GetDetailByIdAll($id) {
        $vSql = "";

        $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
        return $vResultado;
     }


    public function GetUserName($id){}
    public function GetMail($id){}
    public function State($id){}
    public function GetAllSpecialitysbyId($id){}
    public function GetInstitution($id){}
    public function GetWorkCharge($id){}
    public function GetInsuranceType($id){}
}
