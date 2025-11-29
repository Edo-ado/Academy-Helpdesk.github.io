<?php
class CreateTicketModel
{

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }



    /*En el frontend debes implementar una variable que guarde el id de este user
    

    id = 17
    Nombre = JavierMilei

  
    */

    //VAINA PA TRAER LOS DATOS NECESARIOS PARA CREAR UN TICKET

    public function bringTags(){
        $sql = "SELECT * FROM Tags WHERE Active = 1;";
        $result = $this->enlace->executeSQL($sql, "asoc");
        return $result;
    }


    public function DeleteTicket($ticket_id){
        $sql = "UPDATE tickets SET active= 0 WHERE id = $ticket_id;";
        $result = $this -> enlace -> executeSQL_DML($sql);
        return $result;


    }



    // este metodo sirve para traer la categoria asociada asi mismo el sla asociado a esa categoria junto a su id pa guardarlo en el ticket
    public function getCategoriesByTags($tagId){
    
        $sql = "SELECT c.Name, c.Id, c.SLAId FROM Categories c
                INNER JOIN Category_Tags ct ON ct.CategoryId = c.Id
                WHERE ct.TagId = $tagId;";

        $result = $this->enlace->executeSQL($sql, "asoc");
        return $result;

    }



    public function createticket($obj)
    {
        
   

        // Obtener tiempos SLA desde la categoría
        $categoryId = isset($obj->CategoryId) ? intval($obj->CategoryId) : 0;

        $sqlCategory = "SELECT sla.MaxTimeResponse, sla.MaxTimeResolution FROM SLA sla  
        INNER JOIN Categories ON sla.Id = Categories.SLAId WHERE Categories.Id = {$categoryId};";
        $catResult = $this->enlace->executeSQL($sqlCategory, "asoc");

        if (!$catResult || count($catResult) == 0) {
            return [
                "success" => false,
                "message" => "Categoría no encontrada",
            ];
        }

        $responseHours = intval($catResult[0]['MaxTimeResponse']);
        $resolutionHours = intval($catResult[0]['MaxTimeResolution']);

             $status = 'Pendiente';

        $sql = "INSERT INTO Tickets
                (Title, Description, Priority,  CategoryId, Ticket_Start_Date, State, Ticket_Response_SLA, Ticket_Resolution_SLA, Active)
                VALUES
                ('{$obj->Title}', '{$obj->Description}', {$obj->PriorityId},  {$categoryId}, NOW(), '{$status}', 
                 DATE_ADD(NOW(), INTERVAL {$responseHours} HOUR), DATE_ADD(NOW(), INTERVAL {$resolutionHours} HOUR), 1);";

        $ticketId = $this->enlace->executeSQL_DML_last($sql);
//para darle un historial
       $sqlHistory = "
    INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, Observation, UserAtCharge, Update_Date)
    VALUES ($ticketId, NULL, 'Pendiente', 'Ticket creado', NULL, NOW())";
    $this->enlace->executeSQL_DML($sqlHistory);


        if ($ticketId  > 0) {
            if (isset($obj->UserId) && intval($obj->UserId) > 0) {
                $idUser = intval($obj->UserId);
                $IdTicket = intval($ticketId);
                $sqlRel = "INSERT INTO usertickets (Userid, TicketId) VALUES ({$idUser}, {$IdTicket});";
                $this->enlace->executeSQL_DML($sqlRel);
            }
            return [
                "success" => true,
                "message" => "Ticket creado correctamente",
                "Id" => $ticketId
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo crear el ticket"
        ];
    }


    public function getAllPriorities()
    {
        $sql = "SELECT * FROM Priorities WHERE Active = 1;";
        $result = $this->enlace->executeSQL($sql, "asoc");
        return $result;
    }

}