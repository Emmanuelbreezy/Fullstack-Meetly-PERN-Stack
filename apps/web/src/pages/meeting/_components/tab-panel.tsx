import { FC } from "react";
import EmptyPanel from "./empty-panel";
import MeetingCard from "./meeting-card";

interface PropsType {
  period: "UPCOMING" | "PAST";
}

const TabPanel: FC<PropsType> = ({ period }) => {
  const data = period === "UPCOMING" ? [""] : [];
  return (
    <div className="w-full">
      {data?.length === 0 ? (
        <EmptyPanel
          title={`No ${period === "UPCOMING" ? "Upcoming" : "Past"} Events`}
        />
      ) : (
        <div className="data--list">
          <ul role="list">
            <li>
              <MeetingCard />
            </li>
            <li>
              <MeetingCard />
            </li>
            <li>
              <MeetingCard />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TabPanel;
