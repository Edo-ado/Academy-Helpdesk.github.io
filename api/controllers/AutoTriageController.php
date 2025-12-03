<?php
class AutoTriageController
{
    // Obtener todos los tickets pendientes
    public function GetAllPendingTickets()
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetAllPendingTickets();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener regla para un ticket
    public function GetApplicableRuleForTicket()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetApplicableRuleForTicket(
                $inputJSON->CategoryId,
                $inputJSON->PriorityId
            );
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener técnicos por especialidad
    public function GetTechniciansBySpeciality($specialityId)
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetTechniciansBySpeciality($specialityId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener técnicos por categoría
    public function GetTechniciansByCategory($categoryId)
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetTechniciansByCategory($categoryId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Asignar ticket
    public function AssignTicket()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->AssignTicket(
                $inputJSON->TicketId,
                $inputJSON->TechnicianId,
                $inputJSON->Remarks,
                $inputJSON->Method
            );
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function AssignTicketToTechnician()
    {
      
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->AssignTicketToTechnician(
                $inputJSON->TicketId,
                $inputJSON->TechnicianId,
                $inputJSON->remarks,
                $inputJSON->Method
            );
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}