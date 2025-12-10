<?php
class NotificationsModel  {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


public function InsertNotificationTechnicianFlowTicket($triggeredUserId, $ticketId, $LastStateTicket, $ActualStateTicket) {
    $sqlTechnician = "INSERT INTO Notifications 
                        (UserId, TicketId, Message, Is_Read, Created_At, Active, TriggeredByUserId, EventType, LastStateTicket, ActualStateTicket) 
                      VALUES 
                        ($triggeredUserId, $ticketId, 'El estado de su ticket a cargo ha sido actualizado', 0, NOW(), 1, $triggeredUserId, 'CAMBIO_ESTADO_TICKET', '$LastStateTicket' , '$ActualStateTicket')";

    $vResultado = $this->enlace->executeSQL_DML($sqlTechnician);
    return $vResultado;
}

public function InsertNotificationAssignTicketTechnician($triggeredUserId, $ticketId) {
    $sqlTechnician = "INSERT INTO Notifications 
                        (UserId, TicketId, Message, Is_Read, Created_At, Active, TriggeredByUserId, EventType) 
                      VALUES 
                        ($triggeredUserId, $ticketId, 'El ticket $ticketId se te ha asignado', 0, NOW(), 1, $triggeredUserId, 'ASIGNACION_TICKET')";

    $vResultado = $this->enlace->executeSQL_DML($sqlTechnician);
    return $vResultado;
}



public function InsertNotificationClienteFlowTicket($triggeredUserId, $ticketId, $clientId, $LastStateTicket, $ActualStateTicket) {
    $sqlClient = "INSERT INTO Notifications 
                    (UserId, TicketId, Message, Is_Read, Created_At, Active, TriggeredByUserId, EventType, LastStateTicket, ActualStateTicket) 
                  VALUES 
                    ($clientId, $ticketId, 'El estado de su ticket ha sido actualizado', 0, NOW(), 1, $triggeredUserId, 'CAMBIO_ESTADO_TICKET', '$LastStateTicket', '$ActualStateTicket'); ";

    $vResultado = $this->enlace->executeSQL_DML($sqlClient); 
    return $vResultado;
}


public function InsertNotificationTechToYourTickeCliente($techassign, $ticketId, $clientId) {
    $sqlClient = "INSERT INTO Notifications 
                  (UserId, TicketId, Message, Is_Read, Created_At, Active, TriggeredByUserId, EventType) 
                 VALUES 
                   ($clientId, $ticketId, 'Su ticket $ticketId ya ha sido asignado a un técnico' , 0, NOW(), 1, $techassign, 'ASIGNACION_TICKET')";

   $vResultado = $this->enlace->executeSQL_DML($sqlClient); 
    return $vResultado;
}



public function InsertNotificationLogIn($userId) {
   
    $vSql = "INSERT INTO Notifications (UserId, TicketId, Message, Is_Read, Created_At, Active, TriggeredByUserId, EventType) 
             VALUES ($userId, NULL, 'Nuevo inicio de sesión en el sistema', 0, NOW(), 1, $userId, 'LOGIN_USER')";

    $vResultado = $this->enlace->executeSQL_DML($vSql);
    return $vResultado;
}

 public function GetCountNotificationsByIDUser($userId) {
    $vSql = "SELECT COUNT(*) as Total
             FROM Notifications
             WHERE UserId = $userId  AND Is_Read = 0;";

    $vResultado = $this->enlace->executeSQL($vSql);
    return $vResultado;
}

public function GetNotificationsByIDUser($iduser){

        $vSql = "SELECT *
             FROM Notifications
             WHERE UserId = $iduser";

    $vResultado = $this->enlace->executeSQL($vSql);
    return $vResultado;
}


 public function UpdateNotificacionIsRead($id){
                    $vSql = "UPDATE Notifications
                    SET Is_Read = 1
                    WHERE Id = $id;  
                    ";

    $vResultado = $this->enlace->executeSQL_DML($vSql);
    return $vResultado;
}
 

public function UpdateNotificacionAllIsRead($iduser) {
    $sql = "UPDATE Notifications
            SET Is_Read = 1
            WHERE UserId = $iduser
            AND Is_Read = 0
            AND Active = 1";

    return $this->enlace->executeSQL_DML($sql);
}






}