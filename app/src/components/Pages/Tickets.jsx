import React, { useEffect, useState } from "react";
import TicketsLists from "../../services/TicketsLists";
import { useUser } from "../../context/UserContext";

export function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedUser } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Aquí usamos la función adaptada por rol y usuario
        const response = await TicketsLists.getTicketsByRolAndUserId(selectedUser?.id);
        const data = response.data;
        console.log("Response from API:", data);

        const mappedData = Array.isArray(data.data)
          ? data.data.map((t) => ({
              id: t.id,
              title: t.Title,
              priority: t.Priority,
              category: t.Category,
            }))
          : [];

        console.log("Mapped data:", mappedData);
        setTickets(mappedData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error al cargar los tickets");
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser?.id) {
      fetchData();
    }
  }, [selectedUser]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "3":
        return "bg-red-600";
      case "2":
        return "bg-yellow-500";
      case "1":
        return "bg-green-600";
      default:
        return "bg-blue-600";
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority?.toLowerCase()) {
      case "3":
        return "border-red-600";
      case "2":
        return "border-yellow-500";
      case "1":
        return "border-green-600";
      default:
        return "border-blue-600";
    }
  };

  const handleTicketClick = (ticketId) => {
    console.log("Clicked ticket:", ticketId);
    window.location.href = `/ticket/${ticketId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">Cargando tickets... :D/</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">No hay tickets disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 tracking-wide drop-shadow-lg mt-6 mb-8">
          Tickets
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-[#e8f6ff] border-2 ${getPriorityBorder(
                ticket.priority
              )} rounded-xl p-6 shadow-md
                         transition-transform duration-300 ease-out
                         hover:-translate-y-2 hover:rotate-1 hover:shadow-xl cursor-pointer`}
              onClick={() => handleTicketClick(ticket.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <p className="font-semibold text-gray-900 text-xl truncate">
                  {ticket.title}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">ID:</p>
                  <p className="text-black font-bold text-lg">#{ticket.id}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Categoría:</p>
                  <p className="text-gray-800 font-semibold">
                    {ticket.category}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Prioridad:</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
