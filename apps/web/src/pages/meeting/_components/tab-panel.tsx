import { FC } from "react";
import EmptyPanel from "./empty-panel";
import MeetingCard from "./meeting-card";
import { MeetingType } from "@/types/api.type";
import { Loader } from "@/components/loader";

interface PropsType {
  isFetching: boolean;
  period: "UPCOMING" | "PAST";
  meetings: MeetingType[];
}

const TabPanel: FC<PropsType> = ({ period, meetings, isFetching }) => {
  return (
    <div className="w-full">
      {isFetching ? (
        <div className="flex items-center justify-center min-h-[15vh]">
          <Loader size="lg" color="black" />
        </div>
      ) : meetings?.length === 0 ? (
        <EmptyPanel
          title={`No ${period === "UPCOMING" ? "Upcoming" : "Past"} Events`}
        />
      ) : (
        <div className="data--list">
          <ul role="list">
            {meetings?.map((meeting) => (
              <li key={meeting.id}>
                <MeetingCard meeting={meeting} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TabPanel;
