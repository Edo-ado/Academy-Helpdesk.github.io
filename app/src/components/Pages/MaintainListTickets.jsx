import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

export default function MaintainListTickets() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const handleDetail = (Id) => {
    navigate(`/ticket/${Id}`);
  };

  if (loading) return <LoadingGrid type="table" count="1" />;
  if (error) return <ErrorAlert title={t("ticketsList.errorTitle")} message={error} />;
  if (!data || data.length === 0) return <EmptyState message={t("ticketsList.noData")} />;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-start gap-6 mb-6 ml-4 sm:ml-8 lg:ml-16">
        <h1 className="text-2xl font-semibold tracking-tight text-[#071f5f] font-sans">
          {t("ticketsList.title")}
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
            <TooltipContent>{t("ticketsList.create")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="rounded-xl border-2 border-[#DFA200] shadow-md ml-4 sm:ml-8 lg:ml-16 w-[85%]">
        <Table>
          <TableHeader className="bg-primary/50">
            <TableRow className="border-b border-[#DFA200]">
              <TableHead className="font-semibold px-9">{t("ticketsList.id")}</TableHead>
              <TableHead className="font-semibold px-9">{t("ticketsList.titleColumn")}</TableHead>
              <TableHead className="font-semibold px-10">{t("ticketsList.category")}</TableHead>
              <TableHead className="font-semibold px-0">{t("ticketsList.actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className="border-b border-[#DFA200]">
                <TableCell className="px-10">
                  <span className={row.Active == 0 ? "line-through text-gray-500" : ""}>
                    {row.id}
                  </span>
                </TableCell>

                <TableCell className="px-10">
                  <span className={row.Active == 0 ? "line-through text-gray-500" : ""}>
                    {row.Title}
                  </span>
                </TableCell>

                <TableCell className="px-10">
                  <span className={row.Active == 0 ? "line-through text-gray-500" : ""}>
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
                      <TooltipContent>{t("ticketsList.viewDetail")}</TooltipContent>
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
        {t("ticketsList.back")}
      </Button>
    </div>
  );
}
