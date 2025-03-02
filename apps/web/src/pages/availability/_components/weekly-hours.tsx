import { z } from "zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dayMapping } from "@/lib/availability";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import DayAvailability from "./day-availability";

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

  const timeGapSchema = z
    .number()
    .int({ message: "Time gap must be an integer" })
    .min(1, { message: "Time gap must be at least 1 minute" })
    .refine((value) => [15, 30, 45, 60, 120].includes(value), {
      message: "Time gap must be 15, 30, 45, 60, or 120 minutes",
    });

  const availabilitySchema = z
    .object({
      timeGap: timeGapSchema,
      availability: z.array(
        z.object({
          day: z.string(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
          isAvailable: z.boolean(),
        })
      ),
    })
    .superRefine((data, ctx) => {
      data.availability.forEach((item, index) => {
        if (item.isAvailable && item.startTime && item.endTime) {
          if (item.endTime <= item.startTime) {
            // Add error to both startTime and endTime fields
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "End time must be greater than start time",
              path: ["availability", index, "startTime"],
            });
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "End time must be greater than start time",
              path: ["availability", index, "endTime"],
            });
          }
        }
      });
    });

  type WeeklyHoursFormData = z.infer<typeof availabilitySchema>;

  const form = useForm<WeeklyHoursFormData>({
    resolver: zodResolver(availabilitySchema),
    mode: "onChange",
    defaultValues: {
      timeGap: 30,
      availability: dummyAvailability,
    },
  });

  const onSubmit = (data: WeeklyHoursFormData) => {
    console.log("Form Data:", data);
  };

  const handleTimeSelect = useCallback(
    (day: string, field: "startTime" | "endTime", time: string) => {
      const index = form
        .getValues("availability")
        .findIndex((item) => item.day === day);
      if (index !== -1) {
        form.setValue(`availability.${index}.${field}`, time, {
          shouldValidate: true,
        });
        form.trigger(`availability.${index}.startTime`);
        form.trigger(`availability.${index}.endTime`);
      }
    },
    [form]
  );

  const onRemove = useCallback(
    (day: string) => {
      const index = form
        .getValues("availability")
        .findIndex((item) => item.day === day);
      if (index !== -1) {
        form.setValue(`availability.${index}.isAvailable`, false);
        form.setValue(`availability.${index}.startTime`, "09:00");
        form.setValue(`availability.${index}.endTime`, "17:00");
      }
    },
    [form]
  );

  console.log(form.formState.errors, "errors");
  console.log(form.getValues(), "getValues");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-0">
        {/* Time Gap Input */}
        <FormField
          name="timeGap"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4 p-5 pb-1">
              <Label className="text-[15px] font-medium shrink-0">
                Time Gap (mins):
              </Label>
              <div className="relative w-full">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="w-[100px] !py-[10px] min-h-[46px]
                     px-[14px] !h-auto"
                    min="1"
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value > 0) {
                        field.onChange(parseInt(e.target.value, 10));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="absolute top-full left-0 mt-2" />
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-1">
          {form.watch("availability").map((day, index) => (
            <DayAvailability
              key={day.day}
              day={day.day}
              isAvailable={day.isAvailable}
              index={index}
              form={form}
              dayMapping={dayMapping}
              onRemove={onRemove}
              onTimeSelect={handleTimeSelect}
            />
          ))}
        </div>

        <div className="w-full pt-4">
          <Button type="submit" className=" !px-10">
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WeeklyHoursRow;
