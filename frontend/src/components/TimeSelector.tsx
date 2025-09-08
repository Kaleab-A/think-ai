/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateTimeSlots } from "@/lib/availability";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  defaultValue?: string;
  name: string;
  timeGap?: number;
  format?: "12h" | "24h";
  className?: string;
  register: any;
  onSelect?: (time: string) => void;
}

const TimeSelector = ({
  name,
  timeGap = 30,
  format = "24h",
  defaultValue,
  register,
  className,
  onSelect,
}: Props) => {
  const [open, setOpen] = useState(false);
  const timeSlots = generateTimeSlots(timeGap, format);

  const handleSelect = (time: string) => {
    onSelect?.(time);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Input
            {...register(name)}
            className={cn(
              `min-h-[46px] px-[14px]
             !py-[10px] !text-[15px] leading-[1.5] cursor-pointer 
            w-[97px] rounded-[8px] !h-auto focus-within:!ring-0`,
              className && className
            )}
            placeholder="Time"
            value={defaultValue}
            readOnly
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="z-10 
        overflow-y-scroll w-[130px] max-h-[204px] mt-2
         bg-white border border-[##d4e0ed] rounded-[6px] p-[8px_0]"
        align="start"
        style={{
          boxShadow: "0 1px 5px rgba(0, 74, 16, 0.15)",
        }}
      >
        <div className="space-y-0">
          {timeSlots.map((time, i) => (
            <Button
              key={i}
              variant="link"
              className="relative flex items-start justify-start w-full !px-4 !py-2
               text-[#0a2540] hover:bg-[#e6f0ff] rounded-none
               text-sm leading-[22px] cursor-pointer !text-left tracking-wide !no-underline !h-auto"
              onClick={() => handleSelect(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimeSelector;
