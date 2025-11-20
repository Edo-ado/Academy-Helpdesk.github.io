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
        
        $status = 'Pendiente';

        // Obtener tiempos SLA desde la categoría
        $sqlCategory = "SELECT sla.MaxTimeResponse, sla.MaxTimeResolution FROM SLA sla  
        INNER JOIN Categories ON sla.Id = Categories.SLAId WHERE Categories.Id = $obj->CategoryId;"; 
        $catResult = $this->enlace->executeSQL($sqlCategory);

        if (!$catResult || count($catResult) == 0) {
            return [
                "success" => false,
                "message" => "Categoría no encontrada",
            ];
        }

        $responseHours = intval($catResult[0]['MaxTimeResponse']);
        $resolutionHours = intval($catResult[0]['MaxTimeResolution']);

        // Usar NOW() en SQL y DATE_ADD para SLA
       

        $sql = "INSERT INTO Tickets
                (Title, Description, PriorityId, UserId, CategoryId, CreationDate, Status, SLA_Response, SLA_Resolution, Active)
                VALUES
                ('$obj->Title', '$obj->Description', $obj->PriorityId, $obj->UserId,$obj->CategoryId, NOW(), '$status', 
                 DATE_ADD(NOW(), INTERVAL {$responseHours} HOUR), DATE_ADD(NOW(), INTERVAL {$resolutionHours} HOUR), 1);";

        $ticketId = $this->enlace->executeSQL_DML_last($sql);

        if ($ticketId  > 0) {
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