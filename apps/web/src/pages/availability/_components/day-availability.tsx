/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react"; // Replace with your actual icon
import TimeSelector from "@/components/TimeSelector";
import { DayOfWeek } from "@/lib/availability";
import { cn } from "@/lib/utils";

interface DayAvailabilityProps {
  day: string;
  isAvailable: boolean;
  index: number;
  form: any;
  dayMapping: Record<string, string>;
  onRemove: (day: string) => void;
  onTimeSelect: (
    day: string,
    field: "startTime" | "endTime",
    time: string
  ) => void;
}

const DayAvailability = ({
  day,
  isAvailable,
  index,
  form,
  dayMapping,
  onRemove,
  onTimeSelect,
}: DayAvailabilityProps) => {
  return (
    <div className="flex items-center gap-10 p-5 min-h-[46px] relative">
      <div className="w-[88px] mt-2.5">
        <div className="inline-flex items-center cursor-pointer">
          <Switch
            checked={isAvailable}
            onCheckedChange={(checked) => {
              form.setValue(`availability.${index}.isAvailable`, checked);
              if (!checked) {
                form.setValue(`availability.${index}.startTime`, "09:00");
                form.setValue(`availability.${index}.endTime`, "17:00");
              }
            }}
          />
          <Label className="ml-2.5 text-[15px] font-semibold uppercase">
            {dayMapping[day] as DayOfWeek}
          </Label>
        </div>
      </div>

      {isAvailable ? (
        <>
          <div className="flex">
            <div className="relative">
              <div className="flex items-center gap-[2px]">
                <FormField
                  name={`availability.${index}.startTime`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TimeSelector
                          name={`availability.${index}.startTime`}
                          defaultValue={field.value}
                          timeGap={form.watch("timeGap")}
                          register={form.register}
                          className={cn(
                            `end--time`,
                            form.formState.errors.availability?.[index]
                              ?.startTime &&
                              "!border-destructive !ring-0 focus-visible:!ring-0"
                          )}
                          onSelect={(time) =>
                            onTimeSelect(day, "startTime", time)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Separator className="w-1 bg-[#0a2540]" />
                <FormField
                  name={`availability.${index}.endTime`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TimeSelector
                          name={`availability.${index}.endTime`}
                          defaultValue={field.value}
                          timeGap={form.watch("timeGap")}
                          register={form.register}
                          className={cn(
                            `end--time`,
                            form.formState.errors.availability?.[index]
                              ?.endTime &&
                              "!border-destructive !ring-0 focus-visible:!ring-0"
                          )}
                          onSelect={(time) =>
                            onTimeSelect(day, "endTime", time)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {form.formState.errors.availability?.[index]?.endTime && (
                <FormMessage className="w-full absolute top-full left-0 !mt-1 mb-1">
                  {form.formState.errors.availability[index].endTime.message}
                </FormMessage>
              )}
            </div>

            <button
              className="ml-2 cursor-pointer flex items-center justify-center size-[44px] p-1 rounded-[4px] text-center hover:bg-gray-50"
              onClick={() => onRemove(day)}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <span className="text-base mt-1 text-[rgba(26,26,26,0.61)]">
          Unavailable
        </span>
      )}
    </div>
  );
};

export default DayAvailability;
