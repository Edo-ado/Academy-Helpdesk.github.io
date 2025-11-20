<?php
class CreateTicketController
{


			public function index()
		{
			$response = new Response();
			$response->toJSON([
				"success" => true,
				"message" => "CreateTicketController funcionando"
			]);
		}

	// Obtener todas las tags activas
	// GET /CreateTicketController/bringTags
	public function bringTags()
	{
		try {
			$response = new Response();
			$model = new CreateTicketModel();
			$result = $model->bringTags();
			$response->toJSON($result);
		} catch (Exception $e) {
			handleException($e);
		}
	}

	// Obtener categorías asociadas a una tag
	// GET /CreateTicketController/getCategoriesByTags/{tagId}
	public function getCategoriesByTags($tagId)
	{
		try {
			$response = new Response();
			$model = new CreateTicketModel();
			$result = $model->getCategoriesByTags($tagId);
			$response->toJSON($result);
		} catch (Exception $e) {
			handleException($e);
		}
	}

	// Crear ticket
	// POST /CreateTicketController  (body: JSON con Title, Description, PriorityId, UserId, TagId, CategoryId)
public function createticket()
{
    try {

        $request = new Request();
        $response = new Response();
        $inputJSON = $request->getJSON();

        $model = new CreateTicketModel();
        $result = $model->createticket($inputJSON);

   
        $response->toJSON($result);

    } catch (Exception $e) {
        handleException($e);
    }
}


	// Eliminar (desactivar) ticket
	// DELETE /CreateTicketController/DeleteTicket/{id}
	public function DeleteTicket($id)
	{
		try {
			$response = new Response();
			$model = new CreateTicketModel();
			$result = $model->DeleteTicket($id);
			$response->toJSON($result);
		} catch (Exception $e) {
			handleException($e);
		}
	}

	public function getAllPriorities(){
		try {
			$response = new Response();
                $Tickets = new CreateTicketModel();
                $result = $Tickets->getAllPriorities();
                $response->toJSON($result);
		} catch (Exception $e) {
			//thr                handleException($e);ow $th;
		}
	}
}






