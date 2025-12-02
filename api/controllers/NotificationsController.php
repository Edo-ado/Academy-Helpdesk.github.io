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


    public function InsertNotificationTechnicianFlowTicket($triggeredUserId,$ticketId)
    {
        try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->InsertNotificationTechnicianFlowTicket($triggeredUserId, $ticketId );
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function InsertNotificationClienteFlowTicket($triggeredUserId, $ticketId, $clientId)
    {
        try {
            $response = new Response();
            $NOTI = new NotificationsModel();
            $result = $NOTI->InsertNotificationClienteFlowTicket($triggeredUserId, $ticketId, $clientId);
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


}