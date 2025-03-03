import { format, addMinutes, parseISO } from "date-fns";

export const formatSelectedSlot = (slot: string | null, timeGap: number) => {
  if (!slot) return null;
  // Decode the slot
  const decodedSlot = decodeURIComponent(slot);
  const startTime = parseISO(decodedSlot);
  // Calculate the end time using the timeGap
  const endTime = addMinutes(startTime, timeGap);
  const formattedDate = format(startTime, "EEEE, MMMM d, yyyy");
  const formattedTime = `${format(startTime, "HH:mm")} – ${format(
    endTime,
    "HH:mm"
  )}`;

  return `${formattedDate}, ${formattedTime}`;
};
