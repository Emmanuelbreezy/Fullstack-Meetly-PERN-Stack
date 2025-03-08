import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react";
import { locationOptions } from "@/lib/types";
import { useBookingState } from "@/hooks/use-booking-state";
import { formatSelectedSlot } from "@/lib/helper";
import { UserType } from "@/types/api.type";

const EventDetails = (props: {
  eventTitle: string;
  user?: UserType;
  username: string;
  duration: number;
  eventLocationType: string;
}) => {
  const { eventTitle, duration, username, user, eventLocationType } = props;

  const navigate = useNavigate();
  const { next, isSuccess, selectedSlot, handleBack } = useBookingState();

  const handleClick = () => {
    if (isSuccess) {
      navigate(`/${username}`);
    }
    if (next) {
      handleBack();
      return;
    }
    navigate(`/${username}`);
  };

  const locationOption = locationOptions.find(
    (option) => option.value === eventLocationType
  );

  return (
    <div
      className="sm:w-96 flex-shrink-0 border-b border-r-0 md:border-r md:border-b-0
         border-[rgba(26,26,26,0.1)] lg:min-h-[550px]"
    >
      <div
        className="relative flex flex-row  items-start justify-start 
          md:justify-center md:flex-col z-10 p-6"
      >
        <button
          type="button"
          onClick={handleClick}
          className="flex justify-center items-center cursor-pointer w-[43px] h-[43px]
               border border-[rgba(26,26,26,0.1)] rounded-full 
               bg-clip-padding
               text-[rgb(0,105,255)] text-[24px]"
        >
          <ArrowLeft />
        </button>

        <div
          className="flex flex-1 flex-col justify-start text-center
             md:justify-center md:text-left"
        >
          <div
            className="text-muted-foreground capitalize mt-4 text-base 
            font-semibold"
          >
            {user?.name}
          </div>
          <h1 className="font-bold text-2xl my-2 leading-[32px] text-[#0a2540]">
            {eventTitle}
          </h1>

          <div className="space-y-2 w-full max-w-52 m-auto font-medium mt-1 text-[#3c3e44]">
            {/* {Meeting Date and time} */}

            {next && (
              <div className="flex justify-start text-[15px] gap-2 items-start">
                <CalendarIcon className="w-4 h-4 shrink-0 mt-1" />
                <span className="font-medium">
                  {selectedSlot
                    ? formatSelectedSlot(selectedSlot, duration)
                    : "No slot selected"}
                </span>
              </div>
            )}

            {duration && (
              <div className="flex justify-start text-[15px] gap-2 items-center">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{duration} Min</span>
              </div>
            )}

            <div className="flex items-center mr-6">
              {locationOption && (
                <>
                  <img
                    src={locationOption?.logo as string}
                    alt={locationOption?.label}
                    className="w-5 h-5 mr-2"
                  />
                  <span className="mt-1">{locationOption?.label}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
