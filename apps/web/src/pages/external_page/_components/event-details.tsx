import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react";
import { VideoConferencingPlatform } from "@/lib/types";
import { useBookingState } from "@/hooks/use-booking-state";
import { formatSelectedSlot } from "@/lib/helper";

const EventDetails = (props: {
  username: string;
  timeGap: number;
  locationOption?: {
    label: string;
    value: VideoConferencingPlatform;
    logo: string;
    isAvailable: boolean;
  };
}) => {
  const { timeGap, username, locationOption } = props;

  const { next, selectedSlot, handleBack } = useBookingState();

  const navigate = useNavigate();

  const handleClick = () => {
    if (next) {
      handleBack();
      return;
    }
    navigate(`/${username}`);
  };
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
            className="text-muted-foreground mt-4 text-base 
            font-semibold"
          >
            TechwithEmma Subscribe
          </div>
          <h1 className="font-bold text-2xl my-2 leading-[32px] text-[#3c3e44]">
            Client Meeting
          </h1>

          <div className="space-y-2 w-full max-w-52 m-auto font-medium mt-1 text-[#3c3e44]">
            {/* {Meeting Date and time} */}

            {next && (
              <div className="flex justify-start text-[15px] gap-2 items-start">
                <CalendarIcon className="w-4 h-4 shrink-0 mt-1" />
                <span className="font-medium">
                  {selectedSlot
                    ? formatSelectedSlot(selectedSlot, timeGap)
                    : "No slot selected"}
                </span>
              </div>
            )}

            {timeGap && (
              <div className="flex justify-start text-[15px] gap-2 items-center">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{timeGap} Min</span>
              </div>
            )}

            <div className="flex items-center mr-6">
              {locationOption && (
                <>
                  <img
                    src={locationOption?.logo}
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
