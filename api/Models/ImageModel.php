<?php
class ImageModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
public function uploadEvidence($object)
    {
        $file = $object['file'];
        $ticket_id = $object['ticket_id'];
        $history_id = $object['history_id'];

        $fileName = $file['name'];
        $tempPath = $file['tmp_name'];

        $fileExt = explode('.', $fileName);
        $fileActExt = strtolower(end($fileExt));

        $newFileName = "evidence-" . uniqid() . "." . $fileActExt;
        $uploadPath = "C:/xampp/htdocs/Academy-Helpdesk.github.io/api/uploads/" . $newFileName;

        if (move_uploaded_file($tempPath, $uploadPath)) {
            $sql = "INSERT INTO Archivador (HistoryTicketId, TicketId, Image, UploadDate)
                    VALUES ($history_id, $ticket_id, '$newFileName', NOW())";
            $resultado = $this->enlace->executeSQL_DML($sql);
            
            if (!empty($resultado)) {
                return ["success" => true, "message" => "Imagen creada"];
            }
        }

        return ["success" => false, "message" => "Error"];
    }

    // OBTENER UNA EVIDENCIA DE UN TICKET (solo la primera)
    public function getEvidenceByTicketId($idTicket)
    {
        $sql = "SELECT * FROM Archivador WHERE TicketId = $idTicket";

        $resultado = $this->enlace->ExecuteSQL($sql);
        if (!empty($resultado)) {
            return $resultado[0];
        }

        return $resultado;
    }
}
