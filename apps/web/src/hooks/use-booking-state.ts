import { parseAsBoolean, useQueryState } from "nuqs";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";

export const useBookingState = () => {
  const [selectedDate, setSelectedDate] = useQueryState<CalendarDate>("date", {
    parse: (value) =>
      new CalendarDate(
        parseInt(value.split("-")[0]),
        parseInt(value.split("-")[1]),
        parseInt(value.split("-")[2])
      ),
    serialize: (value) => `${value.year}-${value.month}-${value.day}`,
  });
  const [selectedSlot, setSelectedSlot] = useQueryState("slot");
  const [next, setNext] = useQueryState(
    "next",
    parseAsBoolean.withDefault(false)
  );

  const handleSelectDate = (date: CalendarDate) => {
    setSelectedDate(date);
  };

  const handleSelectSlot = (slot: string | null) => {
    if (!selectedDate || !slot) {
      setSelectedSlot(null);
      return;
    }
    // Step 1: Combine the selected date with the time slot
    const slotDate = `${format(
      selectedDate.toDate(getLocalTimeZone()),
      "yyyy-MM-dd"
    )}T${slot}:00.000Z`;
    // Step 2: Encode the slot date
    const encodedSlot = encodeURIComponent(slotDate);
    setSelectedSlot(encodedSlot);
  };

  const handleNext = () => {
    setNext(true);
  };

  const handleBack = () => {
    setNext(false);
  };

  return {
    selectedDate,
    selectedSlot,
    next: next,
    handleSelectDate,
    handleSelectSlot,
    handleNext,
    handleBack,
  };
};
