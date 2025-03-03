import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import {
  today,
  getLocalTimeZone,
  DateValue,
  CalendarDate,
} from "@internationalized/date";

import PageContainer from "./_components/page-container";
import { locationOptions } from "@/lib/types";
import BookingCalendar from "./_components/booking-calendar";
import BookingForm from "./_components/booking-form";
import { useBookingState } from "@/hooks/use-booking-state";
import { format } from "date-fns";
import { generateTimeSlots } from "@/lib/availability";
import { cn } from "@/lib/utils";
import EventDetails from "./_components/event-details";

const slots = generateTimeSlots();
const availability = [
  { day: "MONDAY", isAvailable: true, slots: slots },
  { day: "TUESDAY", isAvailable: false, slots: [] },
  {
    day: "WEDNESDAY",
    isAvailable: true,
    slots: ["09:00", "10:00", "11:00"],
  },
  { day: "THURSDAY", isAvailable: true, slots: ["14:00", "15:00"] },
  { day: "FRIDAY", isAvailable: true, slots: ["13:00", "14:00"] },
  { day: "SATURDAY", isAvailable: false, slots: [] },
  { day: "SUNDAY", isAvailable: false, slots: [] },
];

const UserSingleEventPage = () => {
  const param = useParams();
  const username = param.username;
  const [date, setDate] = useState<CalendarDate>(today(getLocalTimeZone()));
  const { next, selectedDate, handleSelectDate, handleSelectSlot } =
    useBookingState();

  const eventLocationType = "GOOGLE_MEET_AND_CALENDAR";

  const locationOption = locationOptions.find(
    (option) => option.value === eventLocationType
  );

  // Get time slots for the selected date
  const timeSlots = selectedDate
    ? availability.find(
        (day) =>
          day.day ===
          format(selectedDate.toDate(getLocalTimeZone()), "EEEE").toUpperCase()
      )?.slots || []
    : [];

  const handleChangeDate = (newDate: DateValue) => {
    const calendarDate = newDate as CalendarDate;
    setDate(calendarDate); // Update local state
    handleSelectSlot(null);
    handleSelectDate(calendarDate); // Update useBookingState hook
  };

  const isDateUnavailable = (date: DateValue) => {
    // Step 1: Get the day of the week (e.g., "MONDAY")
    const dayOfWeek = format(
      date.toDate(getLocalTimeZone()),
      "EEEE"
    ).toUpperCase();
    // Step 2: Check if the day is available
    const dayAvailability = availability.find((day) => day.day === dayOfWeek);
    return !dayAvailability?.isAvailable;
  };

  return (
    <PageContainer
      className={cn(`!min-w-auto sm:!w-auto`, selectedDate && "sm:!w-[98%]")}
    >
      <div
        className="w-full flex flex-col md:flex-row items-stretch 
      justify-stretch p-0 px-1"
      >
        {/* {Event Details} */}
        {/* {Event Details} */}

        <EventDetails
          timeGap={30}
          username={username || ""}
          locationOption={locationOption}
        />
        {/* {Calendar & Booking form} */}
        {/* {Calendar & Booking form} */}
        <div className="min-w-sm max-w-3xl flex-shrink-0 flex-1">
          {next ? (
            <Fragment>
              {/* {Booking Form} */}
              <BookingForm />
            </Fragment>
          ) : (
            <Fragment>
              {/* {Booking Calendar} */}
              <BookingCalendar
                timeSlots={timeSlots}
                minValue={today(getLocalTimeZone())}
                defaultValue={today(getLocalTimeZone())}
                value={selectedDate || date}
                onChange={handleChangeDate}
                isDateUnavailable={isDateUnavailable}
              />
            </Fragment>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UserSingleEventPage;
