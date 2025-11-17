<?php
class SLAModel
{

   public $enlace;

   public function __construct()
   {
      $this->enlace = new MySqlConnect();
   }


   public function GetAllSLAs()
   {
      $vSql = "SELECT * FROM sla where Active=1;";
      $vResultado = $this->enlace->ExecuteSQL($vSql);
      return $vResultado;
   }

   public function GetSLABYId($id)
   {
      $vSql = "SELECT * FROM sla WHERE id = $id;";
      $vResultado = $this->enlace->ExecuteSQL($vSql, [$id]);
      return $vResultado;
   }


   public function CreateSLA($objeto)
   {
      $sql = "INSERT INTO sla (MaxTimeResponse, MaxTimeResolution)
            VALUES ($objeto->MaxTimeResponse, $objeto->MaxTimeResolution);";

      $this->enlace->executeSQL_DML($sql, );

      $iduser = $this->enlace->executeSQL_DML_last($sql);


      return [
         "success" => true,
         "message" => "Técnico creado correctamente",
         "Id" => $iduser
      ];
   }



}