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

    //SUBIR EVIDENCIA PARA UN TICKET
    public function uploadEvidence($object)
    {
        $file = $object['file'];
        $ticket_id = $object['ticket_id'];
        $history_id = $object['history_id'];

        $fileName = $file['name'];
        $tempPath = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];

        if (!empty($fileName)) {

            $fileExt = explode('.', $fileName);
            $fileActExt = strtolower(end($fileExt));

            $fileName = "evidence-" . uniqid() . "." . $fileActExt;

            //Validar extensión
            if (in_array($fileActExt, $this->valid_extensions)) {

                //Validar tamaño
                if ($fileSize < 5000000 && $fileError == 0) {

                    //Subir al servidor
                    if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {

                        //Guardar en la base de datos
                        $sql = "INSERT INTO Archivador (HistoryTicketId, TicketId, Image, UploadDate)
                                VALUES ($history_id, $ticket_id, '$fileName', NOW())";

                        $vResultado = $this->enlace->executeSQL_DML($sql);

                        if ($vResultado > 0) {
                            return 'Imagen creada';
                        }

                        return false;
                    }
                }
            }
        }
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
