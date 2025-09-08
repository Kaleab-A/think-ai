import { CalendarState } from "react-stately";
import {
  DateDuration,
  endOfMonth,
  getWeeksInMonth,
} from "@internationalized/date";
import { DateValue, useCalendarGrid, useLocale } from "react-aria";

import CalendarCell from "./calender-cell";

const CalendarBody = ({
  state,
  offset = {},
  isDateUnavailable,
  timezone,
}: {
  state: CalendarState;
  offset?: DateDuration;
  timezone: string;
  isDateUnavailable?: (date: DateValue) => boolean;
}) => {
  const startDate = state.visibleRange.start.add(offset);
  const endDate = endOfMonth(startDate);
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      startDate,
      endDate,
      weekdayStyle: "short",
    },
    state
  );

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(startDate, locale);
  return (
    <table
      {...gridProps}
      cellPadding="0"
      className="flex-1 border-spacing-[0_8px] calendar--table"
    >
      <thead
        {...headerProps}
        className=" text-xs !font-light 
      uppercase border-spacing-[0_8px]"
      >
        <tr>
          {weekDays.map((day, index) => (
            <th key={index} className="!font-normal">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="calendar--body border-spacing-[0_28px]">
        {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex, startDate)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                    timezone={timezone}
                    isUnavailable={isDateUnavailable?.(date)}
                  />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CalendarBody;
