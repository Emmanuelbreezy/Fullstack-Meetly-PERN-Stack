import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";
import TimeSelector from "@/components/TimeSelector";
import { dayMapping, DayOfWeek } from "@/lib/availability";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WeeklyHoursRow = () => {
  const dummyAvailability = [
    {
      day: "SUNDAY",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: false, // Sunday is typically unavailable
    },
    {
      day: "MONDAY",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      day: "TUESDAY",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      day: "WEDNESDAY",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      day: "THURSDAY",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      day: "FRIDAY",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      day: "SATURDAY",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: false, // Saturday is typically unavailable
    },
  ];

  const [availability, setAvailability] = useState(dummyAvailability);
  const [timeGap, setTimeGap] = useState(30);

  const handleTimeSelect = (
    day: string,
    type: "startTime" | "endTime",
    time: string
  ) => {
    setAvailability((prev) =>
      prev.map((item) => (item.day === day ? { ...item, [type]: time } : item))
    );
  };

  const handleToggleAvailability = (day: string) => {
    setAvailability((prev) =>
      prev.map((item) =>
        item.day === day
          ? {
              ...item,
              isAvailable: !item.isAvailable,
              startTime: !item.isAvailable ? "09:00" : item.startTime,
              endTime: !item.isAvailable ? "17:00" : item.endTime,
            }
          : item
      )
    );
  };

  const handleTimeGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setTimeGap(value);
    }
  };

  const onRemove = () => {};
  return (
    <div className="space-y-1 pt-0">
      <div className="flex items-center gap-4 p-5 pb-1">
        <Label className="text-[15px] font-medium">Time Gap (mins):</Label>
        <Input
          type="number"
          value={timeGap}
          onChange={handleTimeGapChange}
          className="w-[100px] !py-[10px] min-h-[46px] px-[14px] !h-auto"
          min="1"
        />
      </div>

      {availability.map((day) => (
        <div
          key={day.day}
          className="flex items-center gap-10 p-5 min-h-[46px] relative"
        >
          <div className="w-[88px] mt-2.5">
            <Label className="inline-flex items-center cursor-pointer">
              <div className="mr-2.5">
                <Switch
                  checked={day.isAvailable}
                  onCheckedChange={() => handleToggleAvailability(day.day)}
                />
              </div>
              <span className="text-[15px] font-semibold uppercase">
                {dayMapping[day.day as DayOfWeek]}
              </span>
            </Label>
          </div>

          {day.isAvailable ? (
            <div className="flex items-center gap-[2px]">
              <TimeSelector
                defaultValue={day.startTime}
                timeGap={timeGap}
                onSelect={(time) =>
                  handleTimeSelect(day.day, "startTime", time)
                }
              />
              <Separator className="w-1 bg-[#0a2540]" />
              <TimeSelector
                defaultValue={day.endTime}
                timeGap={timeGap}
                onSelect={(time) => handleTimeSelect(day.day, "endTime", time)}
              />
              <button
                className="ml-2 cursor-pointer flex items-center 
              justify-center size-[44px] p-1 rounded-[4px]
               text-center hover:bg-gray-50"
                onClick={onRemove}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-base mt-1 text-[rgba(26,26,26,0.61)]">
              Unavailable
            </span>
          )}
        </div>
      ))}

      <div className="w-full pt-4">
        <Button className="cursor-pointer !px-10">Save changes</Button>
      </div>
    </div>
  );
};

export default WeeklyHoursRow;
