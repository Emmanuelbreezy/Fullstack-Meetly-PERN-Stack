import { format } from "date-fns";
import { Calendar } from "@/components/calendar";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import { useBookingState } from "@/hooks/use-booking-state";

interface BookingCalendarProps {
  timeSlots: string[];
  minValue?: DateValue;
  defaultValue?: DateValue;
  value: DateValue | null;
  onChange: (date: DateValue) => void;
  isDateUnavailable?: (date: DateValue) => boolean;
}

const BookingCalendar = ({
  timeSlots,
  minValue,
  defaultValue,
  value,
  onChange,
  isDateUnavailable,
}: BookingCalendarProps) => {
  const { selectedDate, selectedSlot, handleSelectSlot, handleNext } =
    useBookingState();
  //const timeSlots = generateTimeSlots();

  const decodeSlot = (encodedSlot: string | null) => {
    if (!encodedSlot) return null;
    const decodedSlot = decodeURIComponent(encodedSlot); // Decode the slot
    const time = decodedSlot.slice(11, 16); // Extract the time (e.g., "09:00")
    return time;
  };

  const selectedTime = decodeSlot(selectedSlot);

  return (
    <div className="flex-[1_1_50%] w-full flex-shrink-0 transition-all duration-220 ease-out p-4 pr-0">
      <div className="flex flex-col h-full mx-auto pt-[25px]">
        <h2 className="text-xl mb-5 font-bold">Select a Date &amp; Time</h2>
        <div className="w-full flex flex-row flex-[1_1_300px]">
          <div className="w-full flex justify-start max-w-full md:max-w-sm">
            <Calendar
              minValue={minValue}
              defaultValue={defaultValue}
              value={value}
              onChange={onChange}
              isDateUnavailable={isDateUnavailable}
            />
          </div>
          {selectedDate && (
            <div className="w-full flex-shrink-0 max-w-[40%] pt-0 overflow-hidden md:ml-[19px]">
              <h3 className="h-[38px] mt-0 mb-[10px] font-normal text-base leading-[38px]">
                {format(
                  selectedDate.toDate(getLocalTimeZone()),
                  "EEEE, MMMM d"
                )}
              </h3>
              <div
                className="flex-[1_1_100px] pr-[31px] overflow-x-hidden overflow-y-auto scrollbar-thin
             scrollbar-track-transparent scroll--bar h-[400px]"
              >
                {timeSlots.map((slot, i) => {
                  return (
                    <div role="list" key={i}>
                      <div
                        role="listitem"
                        className="m-[10px_10px_10px_0] relative text-[15px]"
                      >
                        {/* Selected Time and Next Button */}
                        {/* Selected Time and Next Button */}
                        <div
                          className={`absolute inset-0 z-20 flex items-center gap-1.5 justify-between transform transition-all duration-400 ease-in-out ${
                            selectedTime === slot
                              ? "translate-x-0 opacity-100"
                              : "translate-x-full opacity-0"
                          }`}
                        >
                          <button
                            type="button"
                            className="w-full h-[52px] text-white rounded-[4px] bg-black/60 font-semibold disabled:opacity-100 disabled:pointer-events-none tracking-wide"
                            disabled
                          >
                            {slot}
                          </button>
                          <button
                            type="button"
                            className="w-full cursor-pointer h-[52px] bg-[rgb(0,105,255)] text-white rounded-[4px] hover:bg-[rgba(0,105,255,0.8)] font-semibold tracking-wide"
                            onClick={handleNext}
                          >
                            Next
                          </button>
                        </div>

                        {/* Time Slot Button */}
                        {/* Time Slot Button */}
                        {/* Time Slot Button */}
                        <button
                          type="button"
                          className={`w-full h-[52px] cursor-pointer border border-[rgba(0,105,255,0.5)] text-[rgb(0,105,255)] rounded-[4px] font-semibold hover:border-2 hover:border-[rgb(0,105,255)] tracking-wide transition-all duration-400 ease-in-out
                         ${selectedTime === slot ? "opacity-0" : "opacity-100"}
                           `}
                          onClick={() => handleSelectSlot(slot)}
                        >
                          {slot}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
