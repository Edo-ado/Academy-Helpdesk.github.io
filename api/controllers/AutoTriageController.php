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

            if (empty($result)) {
                $response->toJSON([]); // 200 OK con lista vacía
                return;
            }

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


            if (empty($result)) {
                $response->toJSON([]); // 200 OK con lista vacía
                return;
            }

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


            if (empty($result)) {
                $response->toJSON([]); // 200 OK con lista vacía
                return;
            }
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

  
    public function GetTechniciansByCategory($categoryId)
    {
        try {
            $response = new Response();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->GetTechniciansByCategory($categoryId);
            if (empty($result)) {
                $response->toJSON([]); // 200 OK con lista vacía
                return;
            }
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }





    public function UpdateTicket()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();

            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->UpdateTicket(
                $inputJSON->TicketId,
                $inputJSON->TechnicianId,
            );
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function InsertsTicket()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $autoTriage = new AutoTriageModel();
            $result = $autoTriage->Inserts(
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
}
