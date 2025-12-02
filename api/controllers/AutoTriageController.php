<?php
class AutoTriageController
{
    // GETALL
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController
    public function index()
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetAllAutoTriageRules();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Get all active rules
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/GetAllAutoTriageRulesActive
    public function GetAllAutoTriageRulesActive()
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetAllAutoTriageRulesActive();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GetByID
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/get/1
    public function get($param)
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetAutoTriageRuleById($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GetDetails
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/details/1
    public function details($param)
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetAutoTriageRuleDetailsByID($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    // Get pending tickets for auto assignment
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/GetPendingTicketsForAutoTriage
   public function GetPendingTicketsForAutoTriage()
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetPendingTicketsForAutoTriage();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response = new Response();
            $response->toJSON([
                'error' => true,
                'message' => $e->getMessage()
            ]);
        }
    }

    // Get technicians by speciality
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/GetTechniciansBySpeciality/1
    public function GetTechniciansBySpeciality($param)
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetTechniciansBySpeciality($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Get applicable rule for ticket
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/GetApplicableRuleForTicket/1/2
    public function GetApplicableRuleForTicket($categoryId, $priorityId)
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetApplicableRuleForTicket($categoryId, $priorityId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Assign ticket to technician
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/AssignTicketToTechnician
    public function AssignTicketToTechnician()
    {
        try {
            $response = new Response();
            $request = new Request();
            $inputJSON = $request->getJSON();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->AssignTicketToTechnician(
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





    //manual assignment functions


    // Asignación manual de ticket
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/ManualAssignTicket
    public function ManualAssignTicket()
    {
        try {
            $response = new Response();
            $request = new Request();
            $inputJSON = $request->getJSON();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->ManualAssignTicket(
                $inputJSON->TicketId,
                $inputJSON->TechnicianId,
                $inputJSON->Remarks
            );
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener información para asignación manual
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/GetManualAssignmentInfo/1
    public function GetManualAssignmentInfo($param)
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetManualAssignmentInfo($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener todos los técnicos con carga de trabajo
    // http://localhost/Academy-Helpdesk.github.io/api/AutoTriageController/GetAllTechniciansWithWorkload
    public function GetAllTechniciansWithWorkload()
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetAllTechniciansWithWorkload();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}