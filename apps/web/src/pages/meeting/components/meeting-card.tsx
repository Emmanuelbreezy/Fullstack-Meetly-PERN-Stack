import { useRef, useState } from "react";
import { ChevronDown, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

const details = [
  { label: "Email", value: "subscribeto@techwithemma.com" },
  { label: "Location", value: "No location given" },
  {
    label: "Questions",
    value: "Nothing",
  },
];

const MeetingCard = () => {
  const [isShow, setIsShow] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const toggleDetails = () => {
    setIsShow(!isShow);
  };
  return (
    <div className="w-full">
      <h2
        className="day-header p-[16px_24px] border-y
      border-[#D4E16F] bg-[#fafafa] text-base font-bold tracking-wide"
      >
        Wednesday, 19 March 2025
      </h2>

      {/* {Event body} */}
      {/* {Event body} */}
      <div role="buton" className="event-list-body" onClick={toggleDetails}>
        <div
          className="flex flex-row bg-white relative w-full p-6 text-left 
        cursor-pointer transition-colors duration-200 ease-in-out"
        >
          <div
            className="flex-shrink-0 box-border pr-4 pl-10 inline-block
          mb-[5px]"
          >
            <span className="event-time">11:00 - 11:30</span>
            <span
              className="absolute bg-primary/70
              top-[19px] left-[23px] inline-block box-border w-[30px]
             h-[30px] rounded-full"
            ></span>
          </div>

          <div className="flex-1">
            <h5>
              <strong>Boniface</strong>
            </h5>
            <p>
              Event type <strong> my new one</strong>
            </p>
          </div>
          {/* {Meeting detail Button} */}
          <div className="flex shrink-0">
            <button className="flex gap-px items-center cursor-pointer !text-[rgba(26,26,26,0.61)] text-base leading-[1.4] whitespace-nowrap">
              <ChevronDown
                fill="rgba(26,26,26,0.61)"
                className=" w-6 h-6
               !fill-[rgba(26,26,26,0.61)]"
              />
              More
            </button>
          </div>
        </div>
      </div>

      {/* {Event Details} */}
      {/* {Event Details} */}
      {/* {Event Details} */}
      <div
        ref={detailsRef}
        className="event-details overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isShow ? `${detailsRef.current?.scrollHeight}px` : "0px",
          padding: isShow ? "8px 24px 24px 24px" : "0 24px",
        }}
      >
        <div className="flex pb-5">
          <div className="box-border shrink-0 w-[310px] pr-[80px] pl-[40px] mb-5">
            <div>
              <Button
                variant="outline"
                className="!w-full border-[#476788] text-[#0a2540] font-normal text-sm"
              >
                <Trash2Icon />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <ul>
              {details.map((item, index) => (
                <li key={index} className="mb-4">
                  <h5 className="inline-block mb-1 font-bold text-sm leading-[14px] uppercase">
                    {item.label}
                  </h5>
                  <p className="font-normal text-[15px]">
                    {item.label === "Questions" && (
                      <span className="block font-light text-sm mb-1 text-[rgba(26,26,26,0.61))]">
                        Please share anything that will help prepare for our
                        meeting.
                      </span>
                    )}
                    {item.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
