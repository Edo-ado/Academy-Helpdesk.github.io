<?php
class dashboardModel
{


    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


    public function TicketsPerMonth()
    {
        $query = "SELECT MONTH(Ticket_Start_Date) AS Mes,
COUNT(*) AS Total_Tickets 
FROM Tickets WHERE YEAR(Ticket_Start_Date) = YEAR(current_date())
GROUP BY MONTH(Ticket_Start_Date)
ORDER BY MONTH(Ticket_Start_Date)";
        $result = $this->enlace->$query;
        return $result;
    }

    public function CantTicketsPerState()
    {
        $sql = "SELECT 
    State AS Estado,
    COUNT(*) AS Total_Tickets
FROM Tickets
WHERE State IN ('Pendiente', 'Asignado', 'En Proceso', 'Resuelto', 'Cerrado')
GROUP BY State
";



        $result = $this->enlace->$sql;
        return $result;
    }


    public function PromedioValoraciones()
    {
        $sql = "SELECT 
    AVG(Rating) AS PromedioValoracion
FROM Ratings;";
        $result = $this->enlace->$sql;
        return $result;
    }


    public function CategoriasConInco()
    {
        $sql = "SELECT 
    c.Name AS Categoria,
    COUNT(t.Id) AS TotalTickets,
    SUM(CASE WHEN t.Response_Compliance = FALSE THEN 1 ELSE 0 END) AS IncumplimientosRespuesta,
    SUM(CASE WHEN t.Resolution_Compliance = FALSE THEN 1 ELSE 0 END) AS IncumplimientosResolucion,
    SUM(CASE WHEN t.Response_Compliance = FALSE THEN 1 ELSE 0 END) + 
    SUM(CASE WHEN t.Resolution_Compliance = FALSE THEN 1 ELSE 0 END) AS TotalIncumplimientos
FROM 
    Categories c
    JOIN Tickets t ON c.Id = t.CategoryId
WHERE 
    t.Active = TRUE
GROUP BY 
    c.Id, c.Name
HAVING 
    TotalIncumplimientos > 0
ORDER BY 
    TotalIncumplimientos DESC;";

        $result = $this->enlace->$sql;
        return $result;
    }

    public function RankingTechByCump()
    {
        $sql = "SELECT 
    u.UserName AS Tecnico,
    u.Work_Charge AS Cargo,
    COUNT(t.Id) AS TotalTickets,
    SUM(CASE WHEN t.Response_Compliance = TRUE THEN 1 ELSE 0 END) AS CumplimientosRespuesta,
    SUM(CASE WHEN t.Resolution_Compliance = TRUE THEN 1 ELSE 0 END) AS CumplimientosResolucion,
    ROUND(
        (SUM(CASE WHEN t.Response_Compliance = TRUE THEN 1 ELSE 0 END) * 100.0) / 
        COUNT(t.Id), 2) AS PorcentajeCumplimientoRespuesta,
        
    ROUND(
        (SUM(CASE WHEN t.Resolution_Compliance = TRUE THEN 1 ELSE 0 END) * 100.0) / 
        NULLIF(SUM(CASE WHEN t.Ticket_End_Date  THEN 1 ELSE 0 END), 0), 2) AS PorcentajeCumplimientoResolucion
FROM 
    Users u
   inner JOIN Tickets t ON u.Id = t.TechnicianId
WHERE 
    u.RoleId = 1
GROUP BY 
    u.Id, u.UserName, u.Work_Charge
ORDER BY 
    PorcentajeCumplimientoResolucion DESC,
    PorcentajeCumplimientoRespuesta DESC;";
        $result = $this->enlace->$sql;
        return $result;
    }
    
}
