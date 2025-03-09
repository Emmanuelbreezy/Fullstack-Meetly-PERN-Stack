import { FC } from "react";
import EmptyPanel from "./empty-panel";
import MeetingCard from "./meeting-card";
import { MeetingType, PeriodType } from "@/types/api.type";
import { Loader } from "@/components/loader";
import { PeriodEnum } from "@/hooks/use-meeting-filter";

interface PropsType {
  isFetching: boolean;
  period: PeriodType;
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
          title={`No ${
            period === PeriodEnum.UPCOMING
              ? "Upcoming"
              : period === PeriodEnum.PAST
              ? "Past"
              : "Cancelled"
          } Meeting`}
        />
      ) : (
        <div className="data--list">
          <ul role="list">
            {meetings?.map((meeting) => (
              <li key={meeting.id}>
                <MeetingCard period={period} meeting={meeting} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TabPanel;
