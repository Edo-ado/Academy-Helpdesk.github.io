<?php
class UserModel
{

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function GetAllTechnicians()
    {
        $Role = "Technician";
        $vSql = "SELECT 
    
        u.Email,
        u.UserName,
        u.Id,
        u.Usercode,
        u.Active
        FROM 
        users u

        where u.RoleId =1;
    
";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    public function GetAllTechniciansListActive()
    {
        $Role = "Technician";
        $vSql = "SELECT 
    
        u.Email,
        u.UserName,
        u.Id,
        u.Usercode,
        u.Active
        FROM 
        users u
        where u.RoleId= 1 and u.Active = 1;
";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }


    public function GetAllUsers()
    {

        $vSql = "SELECT 
    
        u.Email,
        u.UserName,
        u.Id,
        u.Usercode,
        r.Name AS Rol
        FROM 
        users u


        INNER JOIN 
        roles r On u.RoleId = r.Id

        where
        u.Active = 1
    
";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }


    
public function GetDetailTechnicianById($id)
{
   $vSql = "SELECT 
        u.Id,
        i.Name as NameInsurance,
        u.InsuranceId as idInsu,     
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
        r.Description AS Rol_Descripcion,
        u.Usercode
     FROM  users u
    INNER JOIN  roles r ON u.RoleId = r.Id
    INNER JOIN  insurances i ON u.InsuranceId = i.Id
    WHERE  u.Id = $id";

     $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);

    if (!empty($vResultado)) {

        $vSql = "SELECT SpecialityId as Id FROM Technician_Specialities WHERE UserId = $id";
        $especialidades = $this->enlace->ExecuteSQL($vSql, [$id]);

         $vResultado[0]->Especialidades = $especialidades;
    }

    return $vResultado;
}



    public function GetDetailByIdAll($id)
    {
        $vSql = "SELECT 
        u.Id,
        i.Name as NameInsurance,
        u.InsuranceId as idInsu,     
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
        r.Description AS Rol_Descripcion,
        u.Usercode
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

    public function create($objeto)
    {
        $sql = "INSERT INTO Users 
       (InsuranceId, UserName, Email, Password, RoleId, Last_Login, InstitutionId, State, Work_Charge)
VALUES ('$objeto->seguro', '$objeto->name', '$objeto->email', '$objeto->password', '$objeto->idrol', NOW(), NULL, TRUE, '$objeto->trabajocargo')
";

        $iduser = $this->enlace->executeSQL_DML_last($sql);

        foreach ($objeto->especialidades as $value) {
            $sql = "INSERT INTO Technician_Specialities (UserId, SpecialityId)
                VALUES ($iduser, {$value->Id})";
            $this->enlace->executeSQL_DML($sql);
        }

        return [
            "success" => true,
            "message" => "Técnico creado correctamente",
            "Id" => $iduser
        ];
    }
    
public function update($objeto)
{
  $sql = "UPDATE Users SET 
        InsuranceId = {$objeto->seguro},
        UserName = '{$objeto->name}',
        Email = '{$objeto->email}',
        Password = '{$objeto->password}',
        Work_Charge = '{$objeto->trabajocargo}'
        WHERE Id = {$objeto->id}";

    $this->enlace->executeSQL_DML($sql);

    // eliminar especialidades
    $sql = "DELETE FROM Technician_Specialities WHERE UserId = {$objeto->id}";
    $this->enlace->executeSQL_DML($sql);

    // insertar nuevas
    foreach ($objeto->especialidades as $e) {
        $sql = "INSERT INTO Technician_Specialities (UserId, SpecialityId)
                VALUES ({$objeto->id}, {$e->Id})";
        $this->enlace->executeSQL_DML($sql);
    }

   return $this->GetDetailTechnicianById($objeto->id);
}


    public function GetSeguros()
    {
        $vSql = "SELECT Id, Name, Description FROM Insurances WHERE Active = 1";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }


    public function DeleteUsers($id)
    {

        $sql = "UPDATE  users SET Active = 0 where Id = $id";

        return $this->enlace->executeSQL_DML($sql);

    }

    public function ActivateUser($id){
         $sql = "UPDATE  users SET Active = 1 WHERE Id = $id";

        return $this->enlace->executeSQL_DML($sql);
    }







}
