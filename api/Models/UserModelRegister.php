<?php

use Firebase\JWT\JWT;

class UserModelRegister
{
    public $enlace;
    
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    
    public function all()
    {

        $vSql = "SELECT * FROM Users WHERE Active = TRUE;";
      
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        

        return $vResultado;
    }

    public function get($id)
    {
        $rolM = new UserModel();
     
        $vSql = "SELECT * FROM Users WHERE Id = $id AND Active = TRUE";
        
     
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        
        if ($vResultado && count($vResultado) > 0) {
            $vResultado = $vResultado[0];
            $rol = $rolM->getRolUser($id);
            $vResultado->rol = $rol;
         
            return $vResultado;
        } else {
            return null;
        }
    }
    
    public function allStudents()
    {
  
        $vSql = "SELECT * FROM Users WHERE RoleId = 2 AND Active = TRUE;";
        
      
        $vResultado = $this->enlace->ExecuteSQL($vSql);
     
        return $vResultado;
    }
public function login($objeto)
{
    $vSql = "SELECT * FROM Users WHERE Email = '$objeto->email' AND Active = TRUE";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
    
    if (isset($vResultado[0]) && is_object($vResultado[0])) {
        $user = $vResultado[0];
    
        if (password_verify($objeto->password, $user->Password)) {
         
            $usuario = $this->get($user->Id);
            
            if (!empty($usuario)) {
           
                $data = [
                    'id' => $usuario->Id,
                    'username' => $usuario->UserName,
                    'email' => $usuario->Email,
                    'userCode' => $usuario->UserCode,
                    'rol' => $usuario->rol, 
                    'institutionId' => $usuario->InstitutionId,
                    'iat' => time(),
                    'exp' => time() + 28800
                ];
                
                $jwt_token = JWT::encode($data, Config::get('SECRET_KEY'), 'HS256');
                return $jwt_token;
            }
        }
    }
    
    return false;
}


    
    public function create($objeto)
    {
        if (isset($objeto->password) && $objeto->password != null) {
            $crypt = password_hash($objeto->password, PASSWORD_BCRYPT);
            $objeto->password = $crypt;
        }
        
        
        $vSql = "INSERT INTO Users (InsuranceId, UserName, Email, Password, RoleId, InstitutionId, PositionId, State, Work_Charge, Active)" .
                " VALUES ($objeto->insurance_id, '$objeto->username', '$objeto->email', '$objeto->password', $objeto->role_id, " .
                ($objeto->institution_id ? $objeto->institution_id : 'NULL') . ", " .
                ($objeto->position_id ? $objeto->position_id : 'NULL') . ", " .
                ($objeto->state ? 'TRUE' : 'FALSE') . ", " .
                ($objeto->work_charge ? "'$objeto->work_charge'" : 'NULL') . ", TRUE)";
        
   
        $vResultado = $this->enlace->executeSQL_DML_last($vSql);
        
       
        return $this->get($vResultado);
    }
}
