import { EventType } from "@/types/api.type";
import EventCard from "./event-card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleEventVisibilityMutationFn } from "@/lib/api";
import { toast } from "sonner";

const EventListSection = (props: { events: EventType[]; username: string }) => {
  const { events, username } = props;

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: toggleEventVisibilityMutationFn,
  });

  const toggleEventVisibility = (eventId: string) => {
    mutate(
      {
        eventId: eventId,
      },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({
            queryKey: ["event_list"],
          });
          toast.success(`${response.message}`);
        },
        onError: () => {
          toast.success("Failed to switch event");
        },
      }
    );
  };
  return (
    <div className="w-full">
      <div
        className="
        grid grid-cols-[repeat(auto-fill,minmax(min(calc(100%/3-24px),max(280px,calc(100%-48px)/3)),1fr))]
         gap-6 py-[10px] pb-[25px]
        "
      >
        {events?.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            slug={event.slug}
            duration={event.duration}
            isPrivate={event.isPrivate}
            username={username}
            isPending={isPending}
            onToggle={() => toggleEventVisibility(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventListSection;
