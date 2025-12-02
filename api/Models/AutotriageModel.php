<?php
class AutoTriageModel
    {
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Obtener todas las reglas de AutoTriage activas
    public function GetAllAutoTriageRulesActive()
    {
        $vSql = "SELECT * FROM Autotriage WHERE Active = 1 ORDER BY RuleOrder ASC;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    // Obtener todas las reglas de AutoTriage
    public function GetAllAutoTriageRules()
    {
        $vSql = "SELECT * FROM Autotriage ORDER BY RuleOrder ASC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    // Obtener regla de AutoTriage por ID
    public function GetAutoTriageRuleById($id)
    {
        $sql = "SELECT * FROM Autotriage WHERE Id = $id;";
        $result = $this->enlace->executeSQL($sql, "asoc");
        return $result;
    }

    // Obtener detalles completos de una regla de AutoTriage
    public function GetAutoTriageRuleDetailsByID($id)
    {
        $vSql = "
        SELECT 
            a.Id,
            a.RuleOrder,
            a.PriorityMin,
            a.Active,
            c.Name AS CategoryName,
            c.Id AS CategoryId,
            s.Speciality AS SpecialityName,
            s.Id AS SpecialityId,
            p.Name AS PriorityName
        FROM Autotriage a
        INNER JOIN Categories c ON a.CategoryId = c.Id
        INNER JOIN Specialities s ON a.SpecialityId = s.Id
        LEFT JOIN Priorities p ON a.PriorityMin = p.Id
        WHERE a.Id = $id
        ";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    // Obtener tickets pendientes para asignación automática
    public function GetPendingTicketsForAutoTriage()
    {
        $vSql = "
        SELECT 
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

    // Obtener técnicos disponibles por especialidad
    public function GetTechniciansBySpeciality($specialityId)
    {
        $vSql = "
        SELECT 
            u.Id AS TechnicianId,
            u.UserName,
            u.Email,
            u.Work_Charge,
            ts.SpecialityId,
            s.Speciality,
            COUNT(t.Id) AS CurrentTicketCount
        FROM Users u
        INNER JOIN Technician_Specialities ts ON u.Id = ts.UserId
        INNER JOIN Specialities s ON ts.SpecialityId = s.Id
        LEFT JOIN Tickets t ON u.Id = t.TechnicianId 
            AND t.State IN ('Asignado', 'En Proceso')
            AND t.Active = 1
        WHERE u.RoleId = 1 
        AND u.Active = 1 
        AND u.State = 1
        AND ts.Active = 1
        AND ts.SpecialityId = $specialityId
        GROUP BY u.Id, u.UserName, u.Email, u.Work_Charge, ts.SpecialityId, s.Speciality
        ORDER BY CurrentTicketCount ASC
        ";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    // Obtener regla de AutoTriage aplicable para un ticket
    public function GetApplicableRuleForTicket($categoryId, $priorityId)
    {
        $vSql = "
        SELECT 
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

    // Asignar ticket a técnico
    public function AssignTicketToTechnician($ticketId, $technicianId, $remarks, $method)
    {
        $ticketId = intval($ticketId);
        $technicianId = intval($technicianId);

        // Actualizar el ticket
        $sql = "UPDATE Tickets 
                SET TechnicianId = $technicianId, 
                    State = 'Asignado' 
                WHERE Id = $ticketId;";
        $this->enlace->executeSQL_DML($sql);

        // Crear registro en Assignments
        $sql = "INSERT INTO Assignments (TicketId, UserId, Assigned_Date, Remarks, Assignment_Method, Active) 
                VALUES ($ticketId, $technicianId, NOW(), '$remarks', '$method', 1)";
        $this->enlace->executeSQL_DML($sql);

        // Crear registro en TicketHistory
        $sql = "INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, Observation, UserAtCharge, Update_Date, Active) 
                VALUES ($ticketId, 'Pendiente', 'Asignado', '$remarks', $technicianId, NOW(), 1)";
        $this->enlace->executeSQL_DML($sql);

        return true;
    }






    
    //asignacion manual de ticket  FALTA DE HACER


    // Asignar ticket manualmente a un técnico específico
    public function ManualAssignTicket($ticketId, $technicianId, $remarks)
    {
        
    }

    // Obtener información completa para asignación manual (técnicos y ticket)
    public function GetManualAssignmentInfo($ticketId)
    {
       
    }

    // Obtener todos los técnicos con su carga de trabajo
    public function GetAllTechniciansWithWorkload()
    {
      

    }
}
