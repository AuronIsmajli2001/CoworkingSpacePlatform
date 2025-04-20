import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
  const events = reservations.map((res) => ({
    id: res.id,
    title: `${res.space.name} - ${res.user.name}`,
    start: new Date(res.startDateTime),
    end: new Date(res.endDateTime),
    status: res.status,
  }));

  console.log("Processed Events:", events);
  events.forEach((event) => {
    console.log(`Event: ${event.title}`, {
      start: event.start.toString(),
      end: event.end.toString(),
      isValidStart: moment(event.start).isValid(),
      isValidEnd: moment(event.end).isValid(),
    });
  });

  return (
    <div
      style={{ height: "80vh", padding: "20px", backgroundColor: "#1f2937" }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        defaultDate={new Date(2025, 3, 1)}
        style={{
          height: "100%",
          color: "white",
        }}
        eventPropGetter={(_: any) => ({
          style: {
            backgroundColor: "#3174ad",
            borderRadius: "4px",
            color: "white",
          },
        })}
      />
    </div>
  );
};

export default CalendarView;
