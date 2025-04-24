import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState } from "react";
type User = {
  id: string;
  name: string;
  email: string;
};

type Space = {
  id: string;
  name: string;
};

type Reservation = {
  id: string;
  userId: string;
  spaceId: string;
  startDateTime: Date;
  endDateTime: Date;
  createdAt: Date;
  status: string;
  user: User;
  space: Space;
};

const localizer = momentLocalizer(moment);

const CalendarView = ({ reservations }: { reservations: Reservation[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1));
  const [currentView, setCurrentView] = useState("month");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const checkIfHoliday = (_date: Date): boolean => {
    return false;
  };

  const events = reservations.map((res) => ({
    id: res.id,
    title: `${res.space.name} - ${res.user.name}`,
    start: new Date(res.startDateTime),
    end: new Date(res.endDateTime),
    status: res.status,
  }));

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleView = (newView: string) => {
    setCurrentView(newView);
  };

  // const checkIfHoliday = (date: Date) => {
  //   return false;
  // };

  return (
    <div
      style={{ height: "467px", padding: "10px", backgroundColor: "#1f2937" }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        view={currentView}
        onNavigate={handleNavigate}
        onView={handleView}
        style={{
          height: "100%",
          color: "white",
          fontSize: "12px",
        }}
        dayPropGetter={(date: Date) => {
          const isCurrentMonth =
            moment(date).month() === moment(currentDate).month();
          const isWeekend = [0, 6].includes(moment(date).day());
          const isHoliday = checkIfHoliday(date);

          return {
            style: {
              minHeight: "60px",
              border: "none",
              backgroundColor: !isCurrentMonth ? "#374151" : "transparent",
              color: !isCurrentMonth ? "#9CA3AF" : "white",
              ...(isWeekend &&
                currentView === "week" && {
                  backgroundColor: "#374151",
                  color: "#9CA3AF",
                }),
              ...(isHoliday && {
                backgroundColor: "#4B5563",
                color: "#F59E0B",
                fontWeight: "bold",
              }),
            },
          };
        }}
        components={{
          dateCellWrapper: ({
            children,
            value,
          }: {
            children: React.ReactNode;
            value: Date;
          }) => {
            const isCurrentMonth =
              moment(value).month() === moment(currentDate).month();
            const isHoliday = checkIfHoliday(value);

            return (
              <div
                style={{
                  backgroundColor: isCurrentMonth ? "transparent" : "#374151",
                  color: isCurrentMonth ? "white" : "#9CA3AF",
                  height: "100%",
                  ...(isHoliday && {
                    backgroundColor: "#4B5563",
                    color: "#F59E0B",
                    fontWeight: "bold",
                  }),
                }}
              >
                {children}
              </div>
            );
          },
          toolbar: (props: any) => (
            <div className="rbc-toolbar">
              <span className="rbc-btn-group">
                <button
                  type="button"
                  onClick={() => props.onNavigate("TODAY")}
                  className="rbc-btn"
                  style={{
                    color: "white",
                    backgroundColor: "transparent",
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => props.onNavigate("PREV")}
                  className="rbc-btn"
                  style={{
                    color: "white",
                    backgroundColor: "transparent",
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => props.onNavigate("NEXT")}
                  className="rbc-btn"
                  style={{
                    color: "white",
                    backgroundColor: "transparent",
                  }}
                >
                  Next
                </button>
              </span>

              <span className="rbc-toolbar-label" style={{ color: "white" }}>
                {props.label}
              </span>

              <span className="rbc-btn-group">
                <button
                  type="button"
                  onClick={() => props.onView("month")}
                  className={`rbc-btn ${
                    props.view === "month" ? "rbc-active" : ""
                  }`}
                  style={{
                    color: props.view === "month" ? "#1f2937" : "white",
                    backgroundColor:
                      props.view === "month" ? "white" : "transparent",
                  }}
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => props.onView("week")}
                  className={`rbc-btn ${
                    props.view === "week" ? "rbc-active" : ""
                  }`}
                  style={{
                    color: props.view === "week" ? "#1f2937" : "white",
                    backgroundColor:
                      props.view === "week" ? "white" : "transparent",
                  }}
                >
                  Week
                </button>
                <button
                  type="button"
                  onClick={() => props.onView("day")}
                  className={`rbc-btn ${
                    props.view === "day" ? "rbc-active" : ""
                  }`}
                  style={{
                    color: props.view === "day" ? "#1f2937" : "white",
                    backgroundColor:
                      props.view === "day" ? "white" : "transparent",
                  }}
                >
                  Day
                </button>
                <button
                  type="button"
                  onClick={() => props.onView("agenda")}
                  className={`rbc-btn ${
                    props.view === "agenda" ? "rbc-active" : ""
                  }`}
                  style={{
                    color: props.view === "agenda" ? "#1f2937" : "white",
                    backgroundColor:
                      props.view === "agenda" ? "white" : "transparent",
                  }}
                >
                  Agenda
                </button>
              </span>
            </div>
          ),
        }}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        eventPropGetter={(_event: Reservation) => ({
          style: {
            backgroundColor: "#3B82F6",
            borderRadius: "4px",
            color: "white",
            fontSize: "11px",
            padding: "1px 3px",
            border: "1px solid #1E40AF",
          },
        })}
      />
    </div>
  );
};
export default CalendarView;

// type User = {
//   id: string;
//   name: string;
//   email: string;
// };

// type Space = {
//   id: string;
//   name: string;
// };

// type Reservation = {
//   id: string;
//   userId: string;
//   spaceId: string;
//   startDateTime: Date;
//   endDateTime: Date;
//   createdAt: Date;
//   status: string;
//   user: User;
//   space: Space;
// };

// const localizer = momentLocalizer(moment);

// const CalendarView = ({ reservations }: { reservations: Reservation[] }) => {
//   const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1));
//   const [currentView, setCurrentView] = useState("month");
//   const handleNavigate = (newDate: Date) => {
//     setCurrentDate(newDate);
//   };
// };

// const handleView = (newView: string) => {
//   setCurrentView(newView);
// };

//   const events = reservations.map((res) => ({
//     id: res.id,
//     title: `${res.space.name} - ${res.user.name}`,
//     start: new Date(res.startDateTime),
//     end: new Date(res.endDateTime),

//     status: res.status,
//   }));

// const checkIfHoliday = (date: Date) => {
//   return false;
// };

// return (
//   <div style={{ height: "500px", padding: "10px", backgroundColor: "#1f2937" }}>
//     endAccessor="end" date={currentDate}
//     view={currentView}
//     onNavigate={handleNavigate}
//     onView={handleView}
//     style=
//     {{
//       height: "100%",
//       color: "white",
//       fontSize: "12px",
//     }}
//     dayPropGetter=
//     {(date) => {
//       const isCurrentMonth =
//         moment(date).month() === moment(currentDate).month();
//       const isWeekend = [0, 6].includes(moment(date).day());
//       const isHoliday = checkIfHoliday(date);

//       return {
//         style: {
//           minHeight: "60px",
//           border: "none",
//           backgroundColor: !isCurrentMonth ? "#374151" : "transparent",
//           color: !isCurrentMonth ? "#9CA3AF" : "white",
//           ...(isWeekend &&
//             currentView === "week" && {
//               backgroundColor: "#374151",
//               color: "#9CA3AF",
//             }),
//           ...(isHoliday && {
//             backgroundColor: "#4B5563",
//             color: "#F59E0B",
//             fontWeight: "bold",
//           }),
//         },
//       };
//     }}
//     components=
//     {{
//       dateCellWrapper: ({
//         children,
//         value,
//       }: {
//         children: React.ReactNode;
//         value: Date;
//       }) => {
//         const isCurrentMonth =
//           moment(value).month() === moment(currentDate).month();
//         const isHoliday = checkIfHoliday(value);

//         return (
//           <div
//             style={{
//               backgroundColor: isCurrentMonth ? "transparent" : "#374151",
//               color: isCurrentMonth ? "white" : "#9CA3AF",
//               height: "100%",
//               ...(isHoliday && {
//                 backgroundColor: "#4B5563",
//                 color: "#F59E0B",
//                 fontWeight: "bold",
//               }),
//             }}
//           >
//             {children}
//           </div>
//         );
//       },
//       toolbar: (props: any) => (
//         <div className="rbc-toolbar">
//           <span className="rbc-btn-group">
//             <button
//               type="button"
//               onClick={() => props.onNavigate("TODAY")}
//               className="rbc-btn"
//               style={{
//                 color: "white",
//                 backgroundColor: "transparent",
//               }}
//             >
//               Today
//             </button>
//             <button
//               type="button"
//               onClick={() => props.onNavigate("PREV")}
//               className="rbc-btn"
//               style={{
//                 color: "white",
//                 backgroundColor: "transparent",
//               }}
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               onClick={() => props.onNavigate("NEXT")}
//               className="rbc-btn"
//               style={{
//                 color: "white",
//                 backgroundColor: "transparent",
//               }}
//             >
//               Next
//             </button>
//           </span>

//           <span className="rbc-toolbar-label" style={{ color: "white" }}>
//             {props.label}
//           </span>

//           <span className="rbc-btn-group">
//             <button
//               type="button"
//               onClick={() => props.onView("month")}
//               className={`rbc-btn ${
//                 props.view === "month" ? "rbc-active" : ""
//               }`}
//               style={{
//                 color: props.view === "month" ? "#1f2937" : "white",
//                 backgroundColor:
//                   props.view === "month" ? "white" : "transparent",
//               }}
//             >
//               Month
//             </button>
//             <button
//               type="button"
//               onClick={() => props.onView("week")}
//               className={`rbc-btn ${props.view === "week" ? "rbc-active" : ""}`}
//               style={{
//                 color: props.view === "week" ? "#1f2937" : "white",
//                 backgroundColor:
//                   props.view === "week" ? "white" : "transparent",
//               }}
//             >
//               Week
//             </button>
//             <button
//               type="button"
//               onClick={() => props.onView("day")}
//               className={`rbc-btn ${props.view === "day" ? "rbc-active" : ""}`}
//               style={{
//                 color: props.view === "day" ? "#1f2937" : "white",
//                 backgroundColor: props.view === "day" ? "white" : "transparent",
//               }}
//             >
//               Day
//             </button>
//             <button
//               type="button"
//               onClick={() => props.onView("agenda")}
//               className={`rbc-btn ${
//                 props.view === "agenda" ? "rbc-active" : ""
//               }`}
//               style={{
//                 color: props.view === "agenda" ? "#1f2937" : "white",
//                 backgroundColor:
//                   props.view === "agenda" ? "white" : "transparent",
//               }}
//             >
//               Agenda
//             </button>
//           </span>
//         </div>
//       ),
//     }}
//     eventPropGetter=
//     {(event) => ({
//       style: {
//         backgroundColor: "#3B82F6",
//         borderRadius: "4px",
//         color: "white",
//         fontSize: "11px",
//         padding: "1px 3px",
//         border: "1px solid #1E40AF",
//       },
//     })}
//   </div>
// );

// export default CalendarView;
