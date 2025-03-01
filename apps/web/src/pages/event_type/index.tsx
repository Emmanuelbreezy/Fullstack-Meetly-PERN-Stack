import UserSection from "./_components/user-section";
import EventListSection from "./_components/event-list-section";
import PageTitle from "@/components/PageTitle";

const EventType = () => {
  return (
    <div className="flex flex-col !gap-8">
      <PageTitle title="Event types" />

      <div className="w-full">
        <UserSection />
        <EventListSection />
      </div>
    </div>
  );
};

export default EventType;
