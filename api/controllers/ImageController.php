<?php
class ImageController
{
    // POST Crear
     public function uploadEvidence()
    {
        $response = new Response();

        $imagen = new ImageModel();
        $result = $imagen->uploadEvidence([
            "file" => $_FILES['file'],
            "ticket_id" => $_POST['ticket_id'],
            "history_id" => $_POST['history_id']
        ]);

        $response->toJSON($result);
    }
}