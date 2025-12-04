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
import Categorieservices from "../../Services/CategoriesList";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LoadingGrid } from "../../components/ui/custom/LoadingGrid";
import { ErrorAlert } from "../../components/ui/custom/ErrorAlert";
import { EmptyState } from "../../components/ui/custom/EmptyState";

export default function MaintainListCategories() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Categorieservices.getAllCategories();

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
    navigate(`/category/edit/${Id}`);
  };

  const handleDetail = (Id) => {
    navigate(`/category/${Id}`);
  };



  const handleDelete = async (Id) => {
  console.log("ID:", Id);

  const response = await Categorieservices.GetCategoryById(Id);

  const category = response.data; // Ajusta según tu backend
  console.log("Categoría:", category.data);

  if (!category) {
    alert(t("categories.notFound"));
    return;
  }

  // Si está inactiva → preguntar si activar
  if (category.data[0].Active == 0) {
    const confirmReactivate = window.confirm(
      t("categories.confirmReactivate")
    );

    if (confirmReactivate) {
      await Categorieservices.ActivateCategory(Id);
    }
    const updatedResponse = await Categorieservices.getAllCategories();
    setData(updatedResponse.data.data);
    return;
  }


  const confirmDelete = window.confirm(
    t("categories.confirmDelete")
  );

  if (confirmDelete) {
    await Categorieservices.DeleteCategoryById(Id);
  }

  // Refrescar la lista después de la eliminación
    const updatedResponse = await Categorieservices.getAllCategories();
    setData(updatedResponse.data.data);
};


  if (loading) return <LoadingGrid type="table" count="1" />;
  if (error)
    return (
      <ErrorAlert title={t("categories.errorTitle")} message={error} />
    );
  if (!data || data.length === 0)
    return <EmptyState message={t("categories.noData")} />;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-start gap-6 mb-6 ml-4 sm:ml-8 lg:ml-16">
        <h1 className="text-2xl font-semibold tracking-tight text-[#071f5f] font-sans">
          {t("categories.listTitle")}
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
                <Link to="/categories/create">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("categories.create")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="rounded-xl border-2 border-[#DFA200] shadow-md ml-4 sm:ml-8 lg:ml-16 w-[85%]">
        <Table>
          <TableHeader className="bg-primary/50">
            <TableRow className="border-b border-[#DFA200]">
              <TableHead className="font-semibold px-8">{t("categories.id")}</TableHead>
              <TableHead className="font-semibold px-8">{t("categories.name")}</TableHead>
              <TableHead className="font-semibold px-8">{t("categories.description")}</TableHead>
              <TableHead className="font-semibold px-8">{t("categories.actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.Usercode}
                className={`border-b border-[#DFA200] ${
                  row.Active == 0 ? "bg-gray-100 opacity-70" : ""
                }`}
              >

                {/* Aqui ta el id */}
                <TableCell className="px-10">
                  <span
                    className={
                      row.Active == 0 ? "line-through text-gray-500" : ""
                    }
                  >
                    {row.Id}
                  </span>
                </TableCell>

                {/* Aqui ta el nombre */}
                <TableCell className="px-10">
                  <span
                    className={
                      row.Active == 0 ? "line-through text-gray-500" : ""
                    }
                  >
                    {row.Name}
                  </span>
                </TableCell>

                {/* Aqui ta la descripcion */}
                <TableCell className="px-10">
                  <span
                    className={
                      row.Active == 0 ? "line-through text-gray-500" : ""
                    }
                  >
                    {row.Descripcion}
                  </span>
                </TableCell>

                {/* Aqui van los botones de accion */}
                <TableCell className="flex gap-1 px-18">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>

                        {/*Aqui esta el de update */}
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={row.Active == 0}
                          className={
                            row.Active == 0
                              ? "opacity-40 "
                              : ""
                          }
                          onClick={() => handleUpdate(row.Id)}
                        >
                          <Edit className="h-4 w-4 text-destructive " />
                        </Button>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>

                         {/*Aqui esta el de detalle */}
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={row.Active == 0}
                          className={
                            row.Active == 0
                              ? "opacity-40 "
                              : ""
                          }
                          onClick={() => handleDetail(row.Id)}
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {row.Active === 0
                          ? t("categories.dataDisabled")
                          : t("categories.viewDetail")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>

                         {/*Aqui esta el de Eliminar */}
                        <Button className="hover"
                          onClick={() => handleDelete(row.Id)}
                        >
                        <Trash2 className="h-4 w-4 text-destructive text-red-600 " />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {row.Active === 0 ? t("categories.alreadyDisabled") : t("categories.delete")}
                      </TooltipContent>
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
        {t("common.back")}
      </Button>
    </div>
  );
}
