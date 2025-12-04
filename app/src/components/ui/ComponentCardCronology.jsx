import React from "react";
import { useTranslation } from "react-i18next";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";
import { Ticket } from "lucide-react";

export default function ComponentCardCronology(props) {
  const { t } = useTranslation();
  var history = Array.isArray(props.history) ? props.history : [];

  function getStateColor(state) {
    if (state === "Pendiente") return "grey";
    if (state === "Asignado") return "info";
    if (state === "En proceso") return "warning";
    if (state === "Resuelto") return "success";
    if (state === "Cerrado") return "secondary";
    return "primary";
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-500 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("ticketHistory.title")}
      </h2>

      <Timeline>
        {history.map(function(item) {
          let stateText;

          if (item.Last_State) {
            stateText = item.Last_State + " → " + item.Actual_State;
          } else {
            stateText = t("ticketHistory.initialState") + " " + item.Actual_State;
          }

          return (
            <TimelineItem key={item.HistoryId}>
              <TimelineOppositeContent color="text.secondary">
                {item.Update_Date}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot color={getStateColor(item.Actual_State)} />
                <TimelineConnector />
              </TimelineSeparator>

              <TimelineContent style={{ paddingTop: "12px", paddingBottom: "12px" }}>
                <Typography variant="h6" className="font-semibold">
                  {stateText}
                </Typography>

                <Typography className="text-gray-600">
                  {t("ticketHistory.responsible")} <span className="font-bold">{item.UserName}</span>
                </Typography>

                <Typography style={{ marginTop: "8px" }}>
                  {item.Observation}
                </Typography>

                {item.EvidencePath ? (
                  <img
                    src={item.EvidencePath}
                    alt={t("ticketHistory.evidence")}
                    className="mt-4 w-64 rounded-xl shadow-md border"
                  />
                ) : null}
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>

      {history.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          {t("ticketHistory.noHistory")}
        </p>
      ) : null}
    </div>
  );
}
