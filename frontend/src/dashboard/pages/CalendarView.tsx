import React, { useState, useRef } from "react";
import FullCalendar, {
  EventInput,
  DateClickArg,
  EventClickArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import moment from "moment";

type User = {
  id: string;
  userName: string;
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

const CalendarView = ({ reservations }: { reservations: Reservation[] }) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentView, setCurrentView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek"
  >("dayGridMonth");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedDayReservations = reservations.filter((res) => {
    if (!selectedDate) return false;
    const start = moment(res.startDateTime);
    return start.isSame(selectedDate, "day");
  });

  const events: EventInput[] = reservations.map((res) => ({
    id: res.id,
    title: `${res.space.name} - ${res.user.userName}`,
    start: res.startDateTime,
    end: res.endDateTime,
  }));

  const goToday = () => {
    calendarRef.current?.getApi().today();
  };

  const goPrev = () => {
    calendarRef.current?.getApi().prev();
  };

  const goNext = () => {
    calendarRef.current?.getApi().next();
  };

  const changeView = (view: typeof currentView) => {
    setCurrentView(view);
    calendarRef.current?.getApi().changeView(view);
  };

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setModalOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    setSelectedDate(moment(arg.event.start).format("YYYY-MM-DD"));
    setModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-270px)] bg-gray-900 text-white rounded-md shadow-md p-4 flex flex-col">
      {/* Custom styles for FullCalendar */}
      <style>{`
        /* Agenda view fixes */
        .fc-list-day-cushion {
          background-color: #1f2937 !important; /* bg-gray-800 */
          color: white !important;
        }
        .fc-list-event {
          background-color: #111827 !important; /* bg-gray-900 */
          border-color: #1f2937 !important; /* border-gray-800 */
        }
        .fc-list-event-time, 
        .fc-list-event-title {
          color: white !important;
        }
        .fc-list-event:hover td {
          background-color: #1e40af !important; /* hover:bg-blue-800 */
        }
        .fc-list-event:hover .fc-list-event-title,
        .fc-list-event:hover .fc-list-event-time {
          color: white !important;
        }
        
        /* General calendar fixes */
        .fc-event:hover {
          opacity: 0.9;
        }
        .fc-daygrid-event:hover {
          background-color: #1e40af !important; /* hover:bg-blue-800 */
        }
        .fc-timegrid-event:hover {
          background-color: #1e40af !important; /* hover:bg-blue-800 */
        }
      `}</style>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
          <button
            onClick={goToday}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            Today
          </button>
          <button
            onClick={goPrev}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button
            onClick={goNext}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Next
          </button>
        </div>

        <div className="text-blue-400 font-bold text-xl">
          {calendarRef.current?.getApi().view.title || ""}
        </div>

        <div className="flex gap-3">
          {[
            { label: "Month", value: "dayGridMonth" },
            { label: "Week", value: "timeGridWeek" },
            { label: "Day", value: "timeGridDay" },
            { label: "Agenda", value: "listWeek" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => changeView(value as any)}
              className={`px-4 py-2 rounded ${
                currentView === value
                  ? "bg-blue-500 font-semibold"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-grow">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={currentView}
          events={events}
          height="100%"
          eventColor="#2563eb"
          eventTextColor="#f9fafb"
          headerToolbar={false}
          nowIndicator={true}
          allDaySlot={false}
          editable={false}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          dayCellClassNames="cursor-pointer"
        />
      </div>

      {/* Modal */}
      {modalOpen && selectedDate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Reservations for {moment(selectedDate).format("MMMM Do, YYYY")}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white hover:text-red-500 font-bold text-2xl"
              >
                &times;
              </button>
            </div>

            {selectedDayReservations.length === 0 && (
              <p>No reservations for this day.</p>
            )}

            {selectedDayReservations.map((res) => (
              <div
                key={res.id}
                className="border border-gray-700 rounded p-3 mb-3 bg-gray-900"
              >
                <p>
                  <span className="font-semibold">Space:</span> {res.space.name}
                </p>
                <p>
                  <span className="font-semibold">User:</span> {res.user.userName}
                </p>
                <p>
                  <span className="font-semibold">Start:</span>{" "}
                  {moment(res.startDateTime).format("HH:mm")}
                </p>
                <p>
                  <span className="font-semibold">End:</span>{" "}
                  {moment(res.endDateTime).format("HH:mm")}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {res.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;