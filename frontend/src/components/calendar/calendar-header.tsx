/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDateFormatter } from "@react-aria/i18n";
import type { CalendarState } from "@react-stately/calendar";
import type { AriaButtonProps } from "@react-aria/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { DOMAttributes, FocusableElement } from "@react-types/shared";

import { CalendarButton } from "./calendar-button";

const CalendarHeader = ({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}: {
  state: CalendarState;
  calendarProps: DOMAttributes<FocusableElement>;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
}) => {
  const monthDateFormatter = useDateFormatter({
    month: "long",
    year: "numeric",
    timeZone: state.timeZone,
  });

  const [monthName, _, year] = monthDateFormatter
    .formatToParts(state.visibleRange.start.toDate(state.timeZone))
    .map((part) => part.value);

  return (
    <div className="flex items-center gap-10 justify-between pb-0 m-[0px_6px_15px]">
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>

      {/* Left Button */}
      <CalendarButton
        {...prevButtonProps}
        className="relative z-10 inline-flex justify-center items-center 
        w-[38px] h-[38px] rounded-full bg-[rgba(0,105,255,0.065)] text-[#0060d4]/80 
        disabled:!bg-transparent disabled:!text-muted-foreground
        "
      >
        <ChevronLeftIcon className="!w-5 !h-5" />
      </CalendarButton>

      {/* Centered Month and Year */}
      <h2 aria-hidden className="text-center font-semibold text-base">
        {monthName}{" "}
        <span className="text-muted-foreground font-medium">{year}</span>
      </h2>

      {/* Right Button */}
      <CalendarButton
        {...nextButtonProps}
        className="relative z-10 inline-flex justify-center items-center 
        w-[38px] h-[38px] rounded-full bg-[rgba(0,105,255,0.065)] text-[#0060d4]/80 "
      >
        <ChevronRightIcon className="!w-5 !h-5" />
      </CalendarButton>
    </div>
  );
};

export default CalendarHeader;
