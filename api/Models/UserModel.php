<?php
class UserModel {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function GetAllTechnicians() {
        $Role = "Technician";
         $vSql = "SELECT 
    u.UserName AS Nombre,
    u.Email,
    r.Name AS Rol
    FROM 
    users u
    INNER JOIN 
    roles r ON u.RoleId = 1;
";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }


   public function GetDetailByIdAll($id) {
    $vSql = "SELECT 
        u.Id,
        i.Name as InsuranceId,
        u.UserName,
        u.Email,
        u.Password,
        u.Last_Login,
        u.InstitutionId,
        u.PositionId,
        u.State,
        u.Work_Charge,
        u.Active,
        r.Name AS Rol,
        r.Description AS Rol_Descripcion
    FROM 
        users u
    INNER JOIN 
        roles r ON u.RoleId = r.Id
    INNER JOIN
        insurances i ON u.InsuranceId = i.Id
    WHERE 
        u.Id = $id";
    
    $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
    return $vResultado;
}



}
