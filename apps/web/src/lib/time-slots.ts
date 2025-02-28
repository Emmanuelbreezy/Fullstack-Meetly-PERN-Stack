export const generateTimeSlots = (
  timeGap: number,
  format: "12h" | "24h" = "24h"
) => {
  const slots = [];
  const totalMinutes = 24 * 60; // 24 hours in minutes

  for (let minutes = 0; minutes < totalMinutes; minutes += timeGap) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const time =
      format === "12h"
        ? `${String(hours % 12 || 12).padStart(2, "0")}:${String(mins).padStart(
            2,
            "0"
          )} ${hours < 12 ? "AM" : "PM"}`
        : `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

    slots.push(time);
  }

  return slots;
};

// export const generateTimeSlots = (timeGap: number) => {
//   const slots = [];
//   const totalMinutes = 24 * 60; // 24 hours in minutes
//   for (let minutes = 0; minutes < totalMinutes; minutes += timeGap) {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     const time = `${String(hours).padStart(2, "0")}:${String(mins).padStart(
//       2,
//       "0"
//     )}`;
//     slots.push(time);
//   }
//   return slots;
// };
