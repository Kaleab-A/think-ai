import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CalendarRange, Copy, Link as LinkIcon } from "lucide-react";
import { ENV } from "@/lib/get-env";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface PropsType {
  id: string;
  title: string;
  slug: string;
  duration: number;
  isPrivate: boolean;
  username: string;
  isPending: boolean;
  onToggle: () => void;
}

const EventCard: FC<PropsType> = ({
  title,
  duration,
  slug,
  isPrivate = false,
  username,
  isPending,
  onToggle,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const event_link = `${ENV.VITE_APP_ORIGIN}/${username}/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(event_link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success("Event link copied");
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
      });
  };
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card">
      <div className="h-1 w-full bg-purple-500 rounded-t-lg" />

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
            <CalendarRange className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-foreground/80">
              {title}
            </h3>
            <Badge variant="secondary" className="mt-1 text-xs font-medium">
              {duration} minutes
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Button variant="link" className="p-0 h-auto text-primary flex items-center gap-2" asChild>
            <Link to={event_link} target="_blank">
              <LinkIcon className="h-4 w-4" />
              View booking page
            </Link>
          </Button>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              disabled={isPrivate}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              {isCopied ? "Copied!" : "Copy link"}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {isPrivate ? "Turn Off" : "Turn On"}
              </span>
              <Switch
                checked={!isPrivate}
                disabled={isPending}
                onCheckedChange={() => !isPending && onToggle()}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
