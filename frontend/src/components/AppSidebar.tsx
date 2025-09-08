import {
  CalendarRange,
  ClockIcon,
  Command,
  LayoutGrid,
  LinkIcon,
  LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";
//import { Separator } from "./ui/separator";
import { Link, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePaths";
import { cn } from "@/lib/utils";

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  separator?: boolean;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { state } = useSidebar();

  const pathname = location.pathname;

  const items: ItemType[] = [
    {
      title: "Event types",
      url: PROTECTED_ROUTES.EVENT_TYPES,
      icon: LinkIcon,
    },
    {
      title: "Meetings",
      url: PROTECTED_ROUTES.MEETINGS,
      icon: CalendarRange,
    },
    {
      title: "Integrations & apps",
      url: PROTECTED_ROUTES.INTEGRATIONS,
      icon: LayoutGrid,
      separator: true,
    },

    {
      title: "Availability",
      url: PROTECTED_ROUTES.AVAILBILITIY,
      icon: ClockIcon,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className={cn(
        state !== "collapsed" && "w-[260px]",
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
      )}
      {...props}
    >
      <SidebarHeader
        className={cn(
          "py-3 relative",
          state !== "collapsed" ? "px-4" : "px-2"
        )}
      >
        <div className="flex h-[50px] items-center gap-1 justify-start ">
          <div
            className="flex aspect-square size-6 items-center 
          justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <Command className="size-4" />
          </div>
          {state !== "collapsed" && (
            <div className="grid flex-1 text-left text-2xl leading-tight ml-px">
              <h2 className="truncate font-medium">Meetly</h2>
            </div>
          )}

          <SidebarTrigger
            className={`-ml-1 cursor-pointer ${
              state === "collapsed" &&
              "absolute -right-5 z-20 rounded-full bg-white border transform rotate-180"
            }`}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="!p-[4px_8px] dark:bg-background">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="hover:!bg-[#e5efff] data-[active=true]:!bg-[#e5efff]"
                isActive={item.url === pathname}
                asChild
              >
                <Link
                  to={item.url}
                  className="!text-[16px] !p-[12px_8px_12px_16px] min-h-[48px] rounded-[8px]
                  !font-semibold
                  "
                >
                  <item.icon className="!w-5 !h-5 !stroke-2" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
