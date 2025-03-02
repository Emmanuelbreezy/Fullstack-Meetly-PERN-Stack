import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import PageContainer from "./_components/page-container";
import { locationOptions } from "@/lib/types";
import BookingCalendar from "./_components/booking-calendar";

const UserSingleEventPage = () => {
  const param = useParams();
  const username = param.username;

  const eventLocationType = "GOOGLE_MEET_AND_CALENDAR";

  const locationOption = locationOptions.find(
    (option) => option.value === eventLocationType
  );

  return (
    <PageContainer>
      <div
        className="w-full flex flex-col md:flex-row items-stretch 
      justify-stretch p-0 px-1"
      >
        <div
          className="lg:w-[35%] shrink-0 border-b border-r-0 md:border-r md:border-b-0
         border-[rgba(26,26,26,0.1)] lg:min-h-[550px]"
        >
          <div
            className="relative flex flex-row  items-start justify-start 
          md:justify-center md:flex-col z-10 p-6"
          >
            <Link
              to={`/${username}`}
              className="flex justify-center items-center w-[43px] h-[43px]
               border border-[rgba(26,26,26,0.1)] rounded-full 
               bg-clip-padding
               text-[rgb(0,105,255)] text-[24px]"
            >
              <ArrowLeft />
            </Link>

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

              <div className="space-y-2 w-full max-w-xs m-auto font-medium mt-1 text-[#3c3e44]">
                <div className="flex justify-start text-[15px] gap-2 items-center">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">15 Min</span>
                </div>

                <div className="flex items-center mr-6">
                  {locationOption && (
                    <>
                      <img
                        src={locationOption.logo}
                        alt={locationOption.label}
                        className="w-5 h-5 mr-2"
                      />
                      <span className="mt-1">{locationOption.label}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {Booking Calendar} */}
        <BookingCalendar />
      </div>
    </PageContainer>
  );
};

export default UserSingleEventPage;
