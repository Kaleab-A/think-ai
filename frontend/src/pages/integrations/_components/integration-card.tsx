/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { connectAppIntegrationQueryFn } from "@/lib/api";
import {
  IntegrationAppEnum,
  IntegrationAppType,
  IntegrationDescriptions,
  IntegrationLogos,
} from "@/lib/types";
import { PlusIcon } from "lucide-react";
import CalendarDialog from "./calendar-dialog";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
  appType: IntegrationAppType;
  title: string;
  isConnected?: boolean;
  isDisabled?: boolean;
}

interface ImageWrapperProps {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  className?: string;
}

const SUCCESS_MESSAGES: Record<any, string> = {
  [IntegrationAppEnum.GOOGLE_MEET_AND_CALENDAR]:
    "Google Calendar connected successfully!",
};

const ERROR_MESSAGES: Record<any, string> = {
  [IntegrationAppEnum.GOOGLE_MEET_AND_CALENDAR]:
    "Failed to connect Google Calendar. Please try again.",
};

const IntegrationCard = ({
  appType,
  title,
  isConnected = false,
  isDisabled = false,
}: IntegrationCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<IntegrationAppType | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  const logos = IntegrationLogos[appType];
  const description = IntegrationDescriptions[appType];

  const handleConnect = async (appType: IntegrationAppType) => {
    setSelectedType(appType);
    setIsLoading(true);
    try {
      const { url } = await connectAppIntegrationQueryFn(appType);
      console.log(SUCCESS_MESSAGES[appType], url);
      setSelectedType(null);
      window.location.href = url;
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to connect Google Calendar:", error);
      toast.error(ERROR_MESSAGES[appType]);
    }
  };

  return (
    <Card className="flex w-full items-center justify-between border border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-col gap-4">
        {Array.isArray(logos) ? (
          <div className="flex items-center gap-4">
            <ImageWrapper src={logos[0]} alt="Google Meet logo" />
            <span className="mx-1">
              <PlusIcon className="w-5 h-5" />
            </span>
            <ImageWrapper src={logos[1]} alt="Google Calendar logo" />
          </div>
        ) : (
          <ImageWrapper src={logos} alt={`${title} logo`} />
        )}
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground max-w-2xl">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-end gap-2 p-4">
        {isConnected ? (
          <>
            <Button variant="outline" size="sm" disabled className="cursor-default w-[180px]">
              Connected
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-[180px]",
                !["GOOGLE_MEET_AND_CALENDAR", "OUTLOOK_CALENDAR"].includes(appType) && "hidden"
              )}
              onClick={() => setOpenDialog(true)}
            >
              Manage calendars
            </Button>
            <CalendarDialog
              open={openDialog}
              onOpenChange={setOpenDialog}
              appType={appType}
            />
          </>
        ) : (
          <Button
            onClick={() => handleConnect(appType)}
            disabled={isDisabled || isLoading}
            size="sm"
            className="w-[180px]"
            aria-disabled={isDisabled}
          >
            {isLoading && selectedType === appType ? (
              <Loader size="sm" color="white" />
            ) : (
              <span>{isDisabled ? "Not available" : "Connect"}</span>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const ImageWrapper: React.FC<ImageWrapperProps> = ({
  src,
  alt,
  height = 30,
  width = 30,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full size-[50px] ${className}`}
      style={{ boxShadow: "0 2px 5px 0 rgb(0 0 0 / 27%)" }}
    >
      <img
        src={src}
        alt={alt}
        height={height}
        width={width}
        className="object-cover"
      />
    </div>
  );
};

export default IntegrationCard;
