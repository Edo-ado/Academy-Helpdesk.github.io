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
WHERE t.TechnicianId = $id;  ";
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
INNER JOIN Users tech ON t.TechnicianId = tech.Id 
INNER JOIN Categories c ON t.CategoryId = c.Id
WHERE ut.UserId = $id;  ";


        $vResultado = $this->enlace->ExecuteSQL($msg);
        return $vResultado;
    }


    
public function WeeklyPartialTechTicketsFilter($id, $fechaInicio, $fechaFin) {
     $query = "SELECT * FROM tickets 
              WHERE TechnicianId = '$id' 
              AND Ticket_Start_Date BETWEEN '$fechaInicio' AND '$fechaFin'";  ;
    



    $vResultado = $this->enlace->ExecuteSQL($query);
    return $vResultado;
}
    






}