import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";

const Calender = () => {
  const router = useRouter();

  const handleDateClick = (clickInfo: DateClickArg) => {
    const dateStr = clickInfo.dateStr.replace(/-/g, "");
    router.push(`/calender/${dateStr}`);
  };

  return (
    <div className="px-10 py-3">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        dateClick={(e: DateClickArg) => {
          handleDateClick(e);
        }}
      />
    </div>
  );
};

export default Calender;
