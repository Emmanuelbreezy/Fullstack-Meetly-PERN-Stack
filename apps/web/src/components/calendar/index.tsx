import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
import { CalendarProps, DateValue, useCalendar, useLocale } from "react-aria";
import CalendarHeader from "./calendar-header";
import CalendarBody from "./calender-body";

interface CalendarExtendedProps extends CalendarProps<DateValue> {
  isDateUnavailable?: (date: DateValue) => boolean;
}

export function Calendar({
  isDateUnavailable,
  ...props
}: CalendarExtendedProps) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    visibleDuration: { months: 1 },
    locale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );
  return (
    <div {...calendarProps} className="inline-block ">
      <CalendarHeader
        state={state}
        calendarProps={calendarProps}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <div className="flex gap-3">
        <CalendarBody state={state} isDateUnavailable={isDateUnavailable} />
      </div>
    </div>
  );
}
