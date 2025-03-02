import { Link, useParams } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import PageContainer from "./_components/page-container";

const UserEventsPage = () => {
  const param = useParams();
  const username = param.username;
  const dummyEvents = [
    {
      eventName: "Team Standup",
      duration: "15 Min",
      description: "",
      slug: "team-standup",
    },
    {
      eventName: "Client Meeting",
      duration: "30 Min",
      description: "Weekly check-in with the client to review project status. ",
      slug: "client-meeting",
    },
    {
      eventName: "Product Demo",
      duration: "45 Min",
      description:
        "Showcase new features and gather feedback from stakeholders.",
      slug: "product-demo",
    },
    {
      eventName: "Strategy Planning",
      duration: "60 Min",
      description:
        "Quarterly session to align on business goals and priorities.",
      slug: "strategy-planning",
    },
  ];

  return (
    <PageContainer>
      {/* {Booking Content } */}
      <div className="py-5">
        <div className="w-full p-[25px_15px]">
          <div
            className="m-[0px_auto_20px] text-center
               max-w-xs flex flex-col items-center justify-center"
          >
            <h1
              className="text-lg font-semibold mb-3
             text-muted-foreground"
            >
              TechwithEmma Subscribe
            </h1>
            <p className="px-5 text-sm font-light text-[rgba(26,26,26,0.61)]">
              Welcome to my scheduling page. Please follow the instructions to
              add an event to my calendar.
            </p>
          </div>

          {/* {Events List} */}
          <div className="md:max-w-[800px] w-full mx-auto flex flex-wrap">
            {dummyEvents.map((event, index) => (
              <Link
                key={index}
                to={`/${username}/${event.slug}`}
                className="group flex-[0_1_calc(100%-40px)] md:flex-[0_1_calc(50%-40px)] 
                     min-h-[150px] m-5 p-5 pr-1 
                    border-t border-[rgba(26,26,26,0.1)] transition-all hover:!bg-[#e5efff] hover:shadow-xs"
              >
                <div className="flex flex-col">
                  <h2 className="flex items-center justify-between text-lg font-semibold">
                    <span className="flex-1">{event.eventName}</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-5">
                    {event.description
                      ? event.description
                      : "No description available"}
                  </p>
                  <p
                    className="inline-flex items-center mt-3 text-sm bg-[#d2e1f9] 
                      px-2 py-1 max-w-24 whitespace-nowrap rounded-sm"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{event.duration}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default UserEventsPage;
