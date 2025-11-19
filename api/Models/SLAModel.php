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
      $maxResp = isset($objeto->MaxTimeResponse) ? intval($objeto->MaxTimeResponse) : 0;
      $maxRes = isset($objeto->MaxTimeResolution) ? intval($objeto->MaxTimeResolution) : 0;

      $sql = "INSERT INTO sla (MaxTimeResponse, MaxTimeResolution)
            VALUES ($maxResp, $maxRes);";

      // Ejecutar y obtener el id insertado
      $id = $this->enlace->executeSQL_DML_last($sql);

      return [
         "success" => true,
         "message" => "SLA creado correctamente",
         "id" => $id
      ];
   }



}