<?php
class NotificationsModel  {

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


public function InsertNotificationTechnicianFlowTicket($triggeredUserId, $ticketId) {
    $sqlTechnician = "INSERT INTO Notifications 
                        (UserId, TicketId, Message, Is_Read, Created_At, Active, TriggeredByUserId, EventType) 
                      VALUES 
                        ($triggeredUserId, $ticketId, 'El estado de su ticket a cargo ha sido actualizado', 0, NOW(), 1, $triggeredUserId, 'CAMBIO_ESTADO_TICKET')";

    $vResultado = $this->enlace->executeSQL_DML($sqlTechnician);
    return $vResultado;
}

public function InsertNotificationClienteFlowTicket($triggeredUserId, $ticketId, $clientId) {
    $sqlClient = "INSERT INTO Notifications 
                    (UserId, TicketId, Message, Is_Read, Created_At, Active, TriggeredByUserId, EventType) 
                  VALUES 
                    ($clientId, $ticketId, 'El estado de su ticket ha sido actualizado', 0, NOW(), 1, $triggeredUserId, 'CAMBIO_ESTADO_TICKET')";

    $vResultado = $this->enlace->executeSQL_DML($sqlClient); 
    return $vResultado;
}


public function InsertNotificationLogIn($userId) {
    $vSql = "INSERT INTO Notifications (UserId, TicketId, Message, Is_Read, Created_At, Active, TriggeredByUserId, EventType) VALUES 
             (userId, NULL, 'Nuevo inicio de sesión en el sistema', 0, NOW(), 1, ?, 'LOGIN_USER')";

    $vResultado = $this->enlace->executeSQL_DML($vSql);
    return $vResultado;
}

 public function GetCountNotificationsByIDUser($userId) {
    $vSql = "SELECT COUNT(*) AS Total
             FROM Notifications
             WHERE UserId = $userId  AND Is_Read = 0";

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


 public function UpdateNotificacionFlowTicketIsReadTechnician($id){

 }

  public function UpdateNotificacionFlowTicketIsReadClient($id){

 }





}