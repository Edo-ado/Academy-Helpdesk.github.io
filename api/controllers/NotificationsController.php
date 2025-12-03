<?php
class NotificationsController
{

    //GETALL
    //http://localhost/Academy-Helpdesk.github.io/api/SLAController
    public function index()
    {
        try {
            $response = new Response();
            $SLA = new NotificationsModel();
            $result = $SLA->GetAllSLAs();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



 public function InsertNotificationTechnicianFlowTicket()
{
    try {
        $response = new Response();
        $NOTI = new NotificationsModel();
        
       
        $data = json_decode(file_get_contents('php://input'), true);
        
        $result = $NOTI->InsertNotificationTechnicianFlowTicket(
            $data['triggeredUserId'],
            $data['ticketId'],
            $data['LastStateTicket'],
            $data['ActualStateTicket']
        );
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}
        public function InsertNotificationAssignTicketTechnician($triggeredUserId,$ticketId)
    {
        try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->InsertNotificationAssignTicketTechnician($triggeredUserId, $ticketId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



public function InsertNotificationClienteFlowTicket()
{
    try {
        $response = new Response();
        $NOTI = new NotificationsModel();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        $result = $NOTI->InsertNotificationClienteFlowTicket(
            $data['triggeredUserId'],
            $data['ticketId'],
            $data['clientId'],
            $data['LastStateTicket'],
            $data['ActualStateTicket']
        );
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}


        public function InsertNotificationLogIn($UserId)
    {
        try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->InsertNotificationLogIn($UserId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

  public function GetCountNotificationsByIDUser($UserId)
    {
        try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->GetCountNotificationsByIDUser($UserId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function GetNotificationsByIDUser($iduser){
       try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->GetNotificationsByIDUser($iduser);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
}


 public function UpdateNotificacionIsRead($id)
    {
        try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->UpdateNotificacionIsRead($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function UpdateNotificacionAllIsRead($iduser){
       try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->UpdateNotificacionAllIsRead($iduser);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
}

  public function GetNotificationWithTicketById($iduser){
       try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->GetNotificationWithTicketById($notificationId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
}

}