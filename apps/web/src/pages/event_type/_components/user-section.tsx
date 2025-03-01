import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ENV } from "@/lib/get-env";
import { PlusIcon } from "lucide-react";

const UserSection = () => {
  const my_link = `${ENV.APP_ORIGIN}/techwithEmma`;
  return (
    <div
      className="w-full flex flex-wrap items-center justify-between 
    mb-5 border-b border-[#D4E162] "
    >
      <div className="flex items-center p-[16px_0_8px] gap-3">
        <div className="w-[54px] h-[54px] flex items-center justify-center">
          <Avatar className="!w-[45px] !h-[45px] !p-px border-2 border-[#CCCCCC] transition-colors">
            <AvatarFallback className="bg-[#e7edf6]">E</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="flex">
            <span
              className="block max-w-[340px] whitespace-nowrap 
            overflow-hidden truncate line-clamp-1 text-sm font-normal"
            >
              TechwithEmma
            </span>
          </div>
          <div className="flex">
            <a target="_blank" href={my_link} className="text-[#004eba]">
              <span
                className="block max-w-[340px] whitespace-nowrap 
            overflow-hidden truncate line-clamp-1 text-sm font-normal"
              >
                {my_link}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* {Create Event } */}
      <div className="flex items-center p-[18px_0]">
        <Button
          variant="outline"
          size="lg"
          className="!w-auto 
         !border-[#476788]
         !text-[#0a2540]
         !font-normal
         !text-sm
        "
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Event Type</span>
        </Button>
      </div>
    </div>
  );
};

export default UserSection;
