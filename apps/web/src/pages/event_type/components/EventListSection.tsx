import EventCard from "./EventCard";

const EventListSection = () => {
  return (
    <div className="w-full">
      <div
        className="
      grid grid-cols-[repeat(auto-fill,minmax(min(calc(100%/2-24px),max(280px,calc(100%-48px)/3)),1fr))]
       gap-6 py-[10px] pb-[25px]
      "
      >
        <EventCard active={true} />
        <EventCard active={false} />
        <EventCard active={true} />
      </div>
    </div>
  );
};

export default EventListSection;
