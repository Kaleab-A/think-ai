import { useRef } from "react";
import { useFocusRing } from "@react-aria/focus";
import { Button } from "@/components/ui/button";
import { type AriaButtonProps, useButton } from "@react-aria/button";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";

export function CalendarButton(
  props: AriaButtonProps<"button"> & {
    state?: CalendarState;
    side?: "left" | "right";
    className?: string;
  }
) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps } = useFocusRing();
  return (
    <Button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      disabled={props.isDisabled}
      variant="ghost"
      size="icon"
      className={props.className}
    >
      {props.children}
    </Button>
  );
}
