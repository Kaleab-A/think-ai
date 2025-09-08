import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CalendarState } from "react-stately";
import {
  CalendarDate,
  getLocalTimeZone,
  isSameMonth,
  isToday,
} from "@internationalized/date";
import { mergeProps, useCalendarCell, useFocusRing } from "react-aria";

const CalendarCell = ({
  state,
  date,
  currentMonth,
  isUnavailable,
  timezone = getLocalTimeZone(),
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  isUnavailable?: boolean;
  timezone: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  // Override isDisabled if the date is unavailable
  const finalIsDisabled = isDisabled || isUnavailable;

  const { focusProps, isFocusVisible } = useFocusRing();

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  const isDateToday = isToday(date, timezone);

  return (
    <td
      {...cellProps}
      className={`py-0.5 px-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(
          finalIsDisabled ? {} : buttonProps, // Only apply buttonProps if the cell is not disabled
          finalIsDisabled ? {} : focusProps // Only apply focusProps if the cell is not disabled
        )}
        ref={ref}
        hidden={isOutsideMonth}
        className="size-10 sm:size-[44px] outline-none group !rounded-full"
      >
        <div
          className={cn(
            "size-full rounded-full cursor-pointer flex items-center justify-center text-[15px] font-semibold",
            finalIsDisabled
              ? "!opacity-80 text-muted-foreground pointer-events-none"
              : "cursor-pointer",
            isFocusVisible ? "group-focus:z-2 ring-gray-12 ring-offset-1" : "",
            isSelected ? "bg-primary text-white" : "",
            !isSelected && !finalIsDisabled
              ? "hover:bg-[rgba(0,105,255,0.15)] bg-[rgba(0,105,255,0.065)] text-[#0060d4]/80 font-bold"
              : ""
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                "absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 bg-primary rounded-full",
                isSelected && "bg-white"
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
};

export default CalendarCell;
