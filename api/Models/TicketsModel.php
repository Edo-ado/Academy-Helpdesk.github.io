<?php
class TicketsMode{

     public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function AllticketsMin(){

        $msg = "SELECT t.id, T.Title, T.Priority, C.Name as Category 
        FROM tickets T 
        INNER JOIN 
        categories C ON T.CategoryId = C.Id";
            $vResultado = $this->enlace->ExecuteSQL($msg);
        return $vResultado;

    }


    public function TicketAssignedToTEC($id){

        


    }



    public function TicketsPerUser($id){
     
        
    }


    




}