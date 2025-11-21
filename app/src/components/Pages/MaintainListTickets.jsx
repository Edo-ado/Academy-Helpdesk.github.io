import * as React from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";

import { Button } from "../../components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

import { Edit, Plus, Trash2, ArrowLeft, Eye } from "lucide-react";
import TicketsServices from "../../Services/TicketsLists";
import { useState, useEffect } from "react";
import { LoadingGrid } from "../../components/ui/custom/LoadingGrid";
import { ErrorAlert } from "../../components/ui/custom/ErrorAlert";
import { EmptyState } from "../../components/ui/custom/EmptyState";

//Headers de la tabla
const ticketsColum = [
  { key: "id", label: "ID" },
  { key: "Title", label: "Título" },
  { key: "Category", label: "Categoria" },
];

export default function MaintainListTickets() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TicketsServices.getAllTicketsMin();

        console.log(response.data);

        if (!response.data.success) {
          setError(response.data.message);
        } else {
          setData(response.data.data);
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (Id) => {
    navigate(`/tickets/update/${Id}`);
  };

  const handleDetail = (Id) => {
    navigate(`/ticket/${Id}`);
  };

  const handleDelete = async (Id) => {
    console.log("ID:", Id);

    const response = await TechnicianServices.getAllTicketsMin(Id);

    const category = response.data;
    console.log("Categoría:", category.data);

    if (!category) {
      alert("No se encontró la categoría");
      return;
    }

    // Si está inactiva → preguntar si activar
    if (category.data[0].Active == 0) {
      const confirmReactivate = window.confirm(
        "El objeto ya está inactivo, ¿desea activarlo?"
      );

      if (confirmReactivate) {
        await TechnicianServices.ActivateUser(Id);
      }
      const updatedResponse = await TicketsServices.getAllTicketsMin();
      setData(updatedResponse.data.data);
      return;
    }


    // Refrescar la lista después de la eliminación
    const updatedResponse = await TicketsServices.getAllTicketsMin();
    setData(updatedResponse.data.data);
  };

  if (loading) return <LoadingGrid type="table" count="1" />;

  if (error)
    return <ErrorAlert title="Error al cargar técnicos" message={error} />;

  if (!data || data.length === 0)
    return <EmptyState message="No se encontraron técnicos." />;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-start gap-6 mb-6 ml-4 sm:ml-8 lg:ml-16">
        <h1 className="text-2xl font-semibold tracking-tight text-[#071f5f] font-sans">
          Listado de Tickets
        </h1>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="text-[#DFA200] border-2 border-[#DFA200] rounded-xl hover:bg-[#1d173f] hover:text-white transition"
              >
                <Link to="/tickets/create">

                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Crear tickets</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="rounded-xl border-2 border-[#DFA200] shadow-md ml-4 sm:ml-8 lg:ml-16w-[85%]">
        <Table>
          <TableHeader className="bg-primary/50">
            <TableRow className="border-b border-[#DFA200]">
              <TableHead className="font-semibold px-9">ID</TableHead>
              <TableHead className="font-semibold px-9">Titulo</TableHead>
              <TableHead className="font-semibold px-10">Categoria</TableHead>
              <TableHead className="font-semibold px-0">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-[#DFA200]"
              >
                <TableCell className="px-10">
                  <span
                    className={
                      row.Active == 0 ? "line-through text-gray-500" : ""
                    }
                  >
                    {row.id}
                  </span>
                </TableCell>

                <TableCell className="px-10">
                  <span
                    className={
                      row.Active == 0 ? "line-through text-gray-500" : ""
                    }
                  >
                    {row.Title}
                  </span>
                </TableCell>

                <TableCell className="px-10">
                  <span
                    className={
                      row.Active == 0 ? "line-through text-gray-500" : ""
                    }
                  >
                    {row.Category}
                  </span>
                </TableCell>

                <TableCell className="flex gap-1 px-18">
                 

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={row.Active == 0}
                          className={row.Active == 0 ? "opacity-40 " : ""}
                          onClick={() => handleDetail(row.id)}
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver detalle</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

               
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6 ml-4 sm:ml-8 lg:ml-16"
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar
      </Button>
    </div>
  );
}
