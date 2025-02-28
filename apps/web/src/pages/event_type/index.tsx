import { HelpCircleIcon } from "lucide-react";
import UserSection from "./components/UserSection";
import EventListSection from "./components/EventListSection";

const EventType = () => {
  return (
    <div className="flex flex-col !gap-8">
      <div className="w-full flex items-center gap-2 min-h-[71px]">
        <h1 className="text-3xl font-bold text-[#0a2540]">Event types</h1>
        <HelpCircleIcon className="w-4 h-4" />
      </div>

      <div className="w-full">
        <UserSection />
        <EventListSection />
      </div>
    </div>
  );
};

export default EventType;
