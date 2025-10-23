<?php
class UserModel {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function GetAllTechnicians($id) {
        $Role = "Technician";
         $vSql = "SELECT 
    u.UserName AS Nombre,
    u.Email,
    r.Name AS Rol
    FROM 
    users u
    INNER JOIN 
<<<<<<< HEAD
    roles r ON u.RoleId = r.Id

where RoleId =$id
 
=======
    roles r ON u.RoleId = 1;
>>>>>>> 5d351ca4d2585cc00deb1e667c54aa355df9afcb
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
