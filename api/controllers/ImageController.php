<?php
class Image
{
    // POST Crear
    public function create()
    {
        try {
            $response = new Response();

            // aquí recibes la imagen desde $_FILES
            $file = $_FILES['file'] ?? null;

            // aquí recibes datos extra (ticketId, historyId)
            $ticket_id = $_POST['ticket_id'] ?? null;
            $history_id = $_POST['history_id'] ?? null;

            if (!$file || !$ticket_id || !$history_id) {
                $response->toJSON([
                    "success" => false,
                    "message" => "Faltan datos para subir la imagen"
                ]);
                return;
            }

            //Instancia del modelo
            $imagen = new ImageModel();

            //Se envía en un array igual al que tu modelo espera
            $data = [
                "file" => $file,
                "ticket_id" => $ticket_id,
                "history_id" => $history_id
            ];

            //Ejecutar método
            $result = $imagen->uploadEvidence($data);

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

            $response->toJSON([
                "success" => false,
                "message" => "Error interno",
            ]);
        }
    }
}
