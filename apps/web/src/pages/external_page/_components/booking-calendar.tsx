import { Calendar } from "@/components/calendar";
import { generateTimeSlots } from "@/lib/availability";

const BookingCalendar = () => {
  const timeSlots = generateTimeSlots();

  return (
    <div className="flex-[1_1_50%] w-[50%] transition-all duration-220 ease-out p-4 pr-0">
      <div className="flex flex-col h-full mx-auto pt-[25px]">
        <h2 className="text-xl mb-5 font-bold">Select a Date &amp; Time</h2>
        <div className="w-full flex flex-row flex-[1_1_300px]">
          <div className="w-full flex justify-center max-w-[60%] mr-[19px]">
            <Calendar />
          </div>
          <div className="w-full max-w-[40%] pt-0 overflow-hidden">
            <h3 className="h-[38px] mt-0 mb-[10px] font-normal text-base leading-[38px]">
              Friday, March 7
            </h3>
            <div
              className="flex-[1_1_100px] pr-[31px] overflow-y-auto scrollbar-thin
             scrollbar-track-transparent scroll--bar h-[400px]"
            >
              {timeSlots.map((time, i) => (
                <div role="list" key={i}>
                  <div role="listitem" className="m-[10px] text-[15px]">
                    <button
                      className="w-full h-[52px] cursor-pointer border border-[rgba(0,105,255,0.5)] 
                   text-[rgb(0,105,255)]  relative align-top rounded-[4px]
                    font-semibold hover:border-2 hover:border-[rgb(0,105,255)] tracking-wide"
                    >
                      {time}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
