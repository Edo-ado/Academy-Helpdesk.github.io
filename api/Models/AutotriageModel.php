<?php
class AutotriageModel
{

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getTicketsPendientes()
    {

        $sql = "SELECT * FROM tickets WHERE STATE = Pendiente AND Active = TRUE;";
        $vResultado = $this->enlace->ExecuteSQL($sql);
        return $vResultado;
    }


    public function getAutoTriage()
    {
        $sql = "SELECT * FROM AUTOTRIAGE WHERE active = True; ";


        $resultao = $this->enlace->ExecuteSQL($sql);
        return $resultao;
    }

    public function GetTicketCategory($ticketId)
    {
        $sql = "SELECT IdCategorY FROM Tickets Where IdTickets = $ticketId; ";
        $resultado = $this->enlace->ExecuteSQL($sql);
        return $resultado;
    }


    public function GetSpecialityCategoryu($categoryId)
    {


        $slq = "SELECT SpecialityId
FROM Category_Specialities
WHERE CategoryId = $categoryId;  ";
        $resultado = $this->enlace->ExecuteSQL($slq);
        return $resultado;
    }


    public function TechThatMatchSpeciality($listaDeSpecialities)
    {
        $sql = "SELECT u.Id, u.UserName
FROM Users u
JOIN Technician_Specialities ts ON ts.UserId = u.Id
WHERE ts.SpecialityId IN $listaDeSpecialities;";

        $resultado = $this->enlace->ExecuteSQL($sql);
        return $resultado;
    }



    public function RegistroAsignacionAutoamtica($ticketId, $techId)
    {

        $sql = " INSERT INTO Assignments (TicketId, UserID, Method, Remarks )
VALUES ($ticketId, $techId, 'Automático', 'Asignado según reglas de Autotriage')";

        $this->enlace->executeSQL_DML_last($sql);
    }

    public function UpdateTicketState($ticketId, $newState)
    {
        $sql = "UPDATE Tickets
                SET State = '$newState'
                WHERE IdTickets = $ticketId;";

        $this->enlace->executeSQL_DML_last($sql);
    }

    public function RegistrarHistorialTicket($ticketId, $techid)
    {
        $sql = "INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, Observation, UserAtCharge)
VALUES ($ticketId, 'Pendiente', 'Asignado', 'Asignado automáticamente', $techid);";

        $this->enlace->executeSQL_DML_last($sql);
    }
}
