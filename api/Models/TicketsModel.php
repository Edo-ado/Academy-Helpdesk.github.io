<?php
class TicketsModel
{

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function AllticketsMin()
    {
        $msg = "SELECT t.id, T.Title, T.Priority, C.Name as Category 
        FROM tickets T 
        INNER JOIN 
        categories C ON T.CategoryId = C.Id  ORDER BY t.id DESC;";
        $vResultado = $this->enlace->ExecuteSQL($msg);
        return $vResultado;
    }

    public function TicketsByRolAndIDUser($id){
         $msg = "SELECT 
    u.Id AS UserId,
    u.UserName,
    r.Name AS RoleName,
    t.Id AS TicketId,
    t.Title,
    t.Description,
    t.State,
    t.Priority,
    t.Ticket_Start_Date,
    t.Ticket_End_Date,
    c.Name AS Category
FROM Users u
INNER JOIN Roles r ON u.RoleId = r.Id
LEFT JOIN Tickets t
INNER JOIN Categories c ON t.CategoryId = c.Id
    ON ( (r.Name = 'Technician' AND t.TechnicianId = u.Id) OR (r.Name = 'Student' AND t.Id IN (  SELECT ut.TicketId FROM UserTickets ut WHERE ut.UserId = u.Id  ))
        OR (r.Name = 'Administrator')
    )
WHERE u.Id = $id
ORDER BY t.Ticket_Start_Date DESC;
";

        $vResultado = $this->enlace->ExecuteSQL($msg);
        return $vResultado;
        

    }

    public function TicketAssignedToTEC($id)
    {
    $msg = "SELECT 
    t.Id AS TicketId,
    t.Title,
    t.Description,
    t.Priority,
    t.State,
    t.Ticket_Start_Date,
    t.Ticket_End_Date,
    c.Name AS Category,
    tech.UserName AS Tecnico,
    u.UserName AS Cliente
FROM Tickets t
INNER JOIN UserTickets ut ON t.Id = ut.TicketId
INNER JOIN Users u ON ut.UserId = u.Id
INNER JOIN Users tech ON t.TechnicianId = tech.Id
INNER JOIN Categories c ON t.CategoryId = c.Id
WHERE t.TechnicianId = $id
AND t.State <> 'Cerrado';";

        $vResultado = $this->enlace->ExecuteSQL($msg);
        return $vResultado;
    }

    public function TicketsPerUser($id)
    {
        $msg = "SELECT 
      t.Id AS TicketId,
    t.Title,
    t.Description,
    t.Priority,
    t.State,
    t.Ticket_Start_Date,
    t.Ticket_End_Date,
    c.Name AS Category,
    u.UserName AS Cliente,
    tech.UserName AS Tecnico
FROM UserTickets ut
INNER JOIN Tickets t ON ut.TicketId = t.Id
INNER JOIN Users u ON ut.UserId = u.Id         
LEFT JOIN Users tech ON t.TechnicianId = tech.Id 
INNER JOIN Categories c ON t.CategoryId = c.Id
WHERE ut.UserId = $id
ORDER BY t.Id DESC;";

        $vResultado = $this->enlace->ExecuteSQL($msg);
        return $vResultado;
    }
    
public function GetTicketById($id) {
    $sql = "SELECT 
                t.Id AS TicketId,
                t.Title,
                t.Description,
                t.Priority,
                t.State,
                t.Ticket_Start_Date,
                t.Ticket_End_Date,
                t.Ticket_Response_SLA,
                t.Ticket_Resolution_SLA,
                c.Name AS Category,
                u.UserName AS Cliente,
                tech.UserName AS Tecnico,
                tc.Id AS CommentId,
                tc.CommentText,
                tc.CommentDate,
                arc.Id AS EvidenceId,
                arc.Image AS EvidencePath,
                arc.UploadDate AS EvidenceDate
            FROM Tickets t
            LEFT JOIN UserTickets ut ON ut.TicketId = t.Id
            LEFT JOIN Users u ON ut.UserId = u.Id
            LEFT JOIN Users tech ON t.TechnicianId = tech.Id
            LEFT JOIN Categories c ON t.CategoryId = c.Id
            LEFT JOIN TicketComments tc ON tc.TicketId = t.Id
            LEFT JOIN Archivador arc ON arc.TicketId = t.Id
            WHERE t.Id = $id";

    $result = $this->enlace->ExecuteSQL($sql);

    
    $baseUrl = "http://localhost/Academy-Helpdesk.github.io/app/public/";


    foreach ($result as $row) {
        if (!empty($row->EvidencePath)) {
            $row->EvidencePath = $baseUrl . $row->EvidencePath;
        }
    }

    return $result;
}


public function GetTicketHistory($ticketId)
{
    $sql = "SELECT 
                Id AS ArchivoId,
                TicketId,
                Image AS Archivo,
                UploadDate
            FROM Archivador
            WHERE TicketId = $ticketId";
    $vResultado = $this->enlace->ExecuteSQL($sql);
    return $vResultado;
}


public function GetDailyAssignments($id, $date)
{
    $sql = "SELECT
        t.Id AS TicketId,
        c.Name AS Category,
        t.State,
        t.Priority,
        TIMESTAMPDIFF(HOUR, NOW(), t.Ticket_Resolution_SLA) AS TimeRemaining
    FROM Tickets t
    INNER JOIN Categories c ON t.CategoryId = c.Id
    WHERE t.TechnicianId = $id
      AND DATE(t.Ticket_Start_Date) = '$date'
    ORDER BY t.Ticket_Start_Date ASC";

    $vResultado = $this->enlace->ExecuteSQL($sql);
    return $vResultado;
}

public function GetWeeklyAssignments($technicianId, $date)
{
    $baseDate = date('Y-m-d', strtotime($date));

    // Calcular lunes y domingo de esa semana
    $startOfWeek = date('Y-m-d', strtotime('monday this week', strtotime($baseDate)));
    $endOfWeek   = date('Y-m-d', strtotime('sunday this week', strtotime($baseDate)));

    $sql = "SELECT 
                t.Id AS TicketId,
                t.Title,
                t.Description,
                t.Priority,
                t.State,
                t.Ticket_Start_Date,
                t.Ticket_End_Date,
                c.Name AS Category,
                TIMESTAMPDIFF(HOUR, NOW(), Ticket_Resolution_SLA) AS TimeRemaining
            FROM Tickets t
            INNER JOIN Categories c ON t.CategoryId = c.Id
            WHERE t.TechnicianId = $technicianId
              AND DATE(t.Ticket_Start_Date) BETWEEN '$startOfWeek' AND '$endOfWeek'
            ORDER BY t.Ticket_Start_Date ASC;";

    $vResultado = $this->enlace->ExecuteSQL($sql);
    return $vResultado;
}


//a ver por varas

public function insertHistory($obj) {
    $sql = "INSERT INTO TicketHistory   (TicketId, Last_State, Actual_State, UserAtCharge, Comment, ImagePath)  VALUES ({$obj->TicketId}, '{$obj->Last_State}', '{$obj->Actual_State}',  {$obj->UserAtCharge}, '{$obj->Comment}', '{$obj->ImagePath}')";

    return $this->enlace->executeSQL_DML_last($sql);
}

public function getHistoryByTicket($ticketId) {
    $sql = "SELECT * FROM TicketHistory WHERE TicketId = $ticketId ORDER BY Update_Date DESC";
    return $this->enlace->executeSQL($sql);
}


}