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
        categories C ON T.CategoryId = C.Id";
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
    t.Ticket_End_Date
FROM Users u
INNER JOIN Roles r ON u.RoleId = r.Id
LEFT JOIN Tickets t
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

    public function GetTicketById($id)
    
    {



        $sql = " SELECT 
        t.Id AS TicketId,
        t.Title,
        t.Description,
        t.Priority,
        t.State,
        t.Ticket_Start_Date,
        t.Ticket_End_Date,
        c.Name AS Category,
        tech.UserName AS Tecnico,
        u.UserName AS Cliente,

        tc.Id AS CommentId,
        tc.CommentText,
        tc.CommentDate,
        cu.UserName AS CommentUser,
        tr.Id AS RatingId,

        tr.Rating,
        tr.Comment AS RatingComment,
        ru.UserName AS RatingUser,
        tr.Rating_Date

    FROM Tickets t
    INNER JOIN UserTickets ut ON t.Id = ut.TicketId
    INNER JOIN Users u ON ut.UserId = u.Id
    INNER JOIN Users tech ON t.TechnicianId = tech.Id
    INNER JOIN Categories c ON t.CategoryId = c.Id

    LEFT JOIN TicketComments tc ON t.Id = tc.TicketId
    LEFT JOIN Users cu ON tc.UserId = cu.Id
    
    LEFT JOIN Ratings tr ON t.Id = tr.TicketId
    LEFT JOIN Users ru ON tr.UserId = ru.Id
    WHERE t.Id = $id
    
    ";
        $vResultado = $this->enlace->ExecuteSQL($sql);
        return $vResultado;
    }


    public function GetTicketHistory($ticketId)
{
    $sql = "SELECT 
                th.Id AS HistoryId,
                th.TicketId,
                th.Last_State,
                th.Actual_State,
                u.UserName AS UserAtCharge,
                th.Update_Date,
                a.Id AS ArchivoId,
                a.Image AS Archivo,
                a.UploadDate
            FROM TicketHistory th
            INNER JOIN Users u ON th.UserAtCharge = u.Id
            LEFT JOIN Archivador a ON th.Id = a.HistoryTicketId
            WHERE th.TicketId = $ticketId
            ORDER BY th.Update_Date DESC;";

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





}