import { format, addMinutes, parseISO } from "date-fns";

export const formatSelectedSlot = (slot: string | null, duration: number) => {
  if (!slot) return null;
  // Decode the slot
  const decodedSlot = decodeURIComponent(slot);
  const startTime = parseISO(decodedSlot);
  // Calculate the end time using the duration
  const endTime = addMinutes(startTime, duration);
  const formattedDate = format(startTime, "EEEE, MMMM d, yyyy");
  const formattedTime = `${format(startTime, "h:mm a")} – ${format(
    endTime,
    "h:mm a"
  )}`;
  // const formattedTime = `${format(startTime, "HH:mm")} – ${format(
  //   endTime,
  //   "HH:mm"
  // )}`;

  return `${formattedDate}, ${formattedTime}`;
};

export const decodeSlot = (encodedSlot: string | null) => {
  if (!encodedSlot) return null;
  const decodedSlot = decodeURIComponent(encodedSlot); // Decode the slot
  const time = decodedSlot.slice(11, 16); // Extract the time (e.g., "09:00")
  return time;
};
