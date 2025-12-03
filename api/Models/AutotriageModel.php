<?php
class AutoTriageModel
    {
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Obtener TODOS los tickets pendientes (sin filtros)
    public function GetAllPendingTickets()
    {
        $vSql = "SELECT 
            t.Id AS TicketId,
            t.Title,
            t.Description,
            t.Priority,
            t.CategoryId,
            t.Ticket_Response_SLA,
            t.Ticket_Resolution_SLA,
            t.Ticket_Start_Date,
            c.Name AS CategoryName,
            p.Name AS PriorityName,
            p.Id AS PriorityId
        FROM Tickets t
        INNER JOIN Categories c ON t.CategoryId = c.Id
        INNER JOIN Priorities p ON t.Priority = p.Id
        WHERE t.State = 'Pendiente' 
        AND t.Active = 1
        ORDER BY t.Ticket_Start_Date ASC
        ";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    // Obtener regla aplicable para un ticket
    public function GetApplicableRuleForTicket($categoryId, $priorityId)
    {
        $categoryId = intval($categoryId);
        $priorityId = intval($priorityId);

        $vSql = "SELECT 
            a.Id,
            a.CategoryId,
            a.PriorityMin,
            a.SpecialityId,
            a.RuleOrder,
            c.Name AS CategoryName,
            s.Speciality AS SpecialityName
        FROM Autotriage a
        INNER JOIN Categories c ON a.CategoryId = c.Id
        INNER JOIN Specialities s ON a.SpecialityId = s.Id
        WHERE a.Active = 1
        AND a.CategoryId = $categoryId
        AND (a.PriorityMin IS NULL OR a.PriorityMin <= $priorityId)
        ORDER BY a.RuleOrder ASC
        LIMIT 1
        ";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    // Obtener técnicos por especialidad
    public function GetTechniciansBySpeciality($specialityId)
    {
        $specialityId = intval($specialityId);

        $vSql = "SELECT 
            u.Id AS TechnicianId,
            u.UserName,
            u.Email,
            u.Work_Charge,
            s.Speciality,
            COUNT(t.Id) AS CurrentTicketCount
        FROM Users u
        INNER JOIN Technician_Specialities ts ON u.Id = ts.UserId
        INNER JOIN Specialities s ON ts.SpecialityId = s.Id
        INNER JOIN Tickets t ON u.Id = t.TechnicianId 
            AND t.State IN ('Asignado', 'En Proceso')
            AND t.Active = 1
        WHERE u.RoleId = 1 
        AND u.Active = 1 
        AND u.State = 1
        AND ts.Active = 1
        AND ts.SpecialityId = $specialityId
       
        ORDER BY CurrentTicketCount ASC
        ";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    // Obtener técnicos por categoría (para asignación manual)
    public function GetTechniciansByCategory($categoryId)
    {
        $categoryId = intval($categoryId);

        $vSql = "SELECT 
            u.Id AS TechnicianId,
            u.UserName,
            u.Email,
            u.Work_Charge,
            GROUP_CONCAT(DISTINCT s.Speciality SEPARATOR ', ') AS Specialities,
            COUNT(DISTINCT t.Id) AS CurrentTicketCount
        FROM Users u
        INNER JOIN Technician_Specialities ts ON u.Id = ts.UserId
        INNER JOIN Specialities s ON ts.SpecialityId = s.Id
        INNER JOIN Category_Specialities cs ON s.Id = cs.SpecialityId
        LEFT JOIN Tickets t ON u.Id = t.TechnicianId 
            AND t.State IN ('Asignado', 'En Proceso')
            AND t.Active = 1
        WHERE u.RoleId = 1 
        AND u.Active = 1
        AND ts.Active = 1
        AND cs.CategoryId = $categoryId
        AND cs.Active = 1
        GROUP BY u.Id, u.UserName, u.Email, u.Work_Charge
        ORDER BY CurrentTicketCount ASC
        ";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    // Asignar ticket
    public function AssignTicket($ticketId, $technicianId, $remarks, $method)
    {

        // Actualizar ticket
        $sql = "UPDATE Tickets 
                SET TechnicianId = $technicianId, 
                    State = 'Asignado' 
                WHERE Id = $ticketId;";
        $this->enlace->executeSQL_DML($sql);

        // Crear asignación
        $sql = "INSERT INTO assignments (TicketId, UserId, Assigned_Date, Remarks, Assignment_Method, Active) 
                VALUES ($ticketId, $technicianId, NOW(), $remarks '$method', 1)";
        $this->enlace->executeSQL_DML($sql);

        // Crear historial
        $sql = "INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, Observation, UserAtCharge, Update_Date, Active) 
                VALUES ($ticketId, 'Pendiente', 'Asignado', '$remarks', $technicianId, NOW(), 1)";
        $this->enlace->executeSQL_DML($sql);

        return [
            'success' => true,
            'message' => 'Ticket asignado correctamente'
        ];
    }

    public function AssignTicketToTechnician($ticketid, $technicianId, $remarks, $method)
    {
        $ticketid = intval($ticketid);
        $technicianId = intval($technicianId);
        $remarks = trim($remarks);
        $method = trim($method);
        
        $sql = "INSERT INTO assignments (TicketId, UserId, Assigned_Date, Remarks, Assignment_Method) VALUES ( $ticketid, $technicianId, Now(),$remarks, $method)";

        $this->enlace->executeSQL_DML($sql);

        return [
            'success' => true,
            'message' => 'Ticket assigned successfully'
        ];
    }
}
