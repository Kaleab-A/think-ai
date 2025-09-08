import UserSection from "./_components/user-section";
import EventListSection from "./_components/event-list-section";
import PageTitle from "@/components/PageTitle";
import { geteventListQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";
import EmptyState from "./_components/empty-state";
import { ErrorAlert } from "@/components/ErrorAlert";

const EventType = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["event_list"],
    queryFn: geteventListQueryFn,
  });

  const events = data?.data.events || [];
  const username = data?.data.username ?? "";

  return (
    <div className="flex flex-col !gap-8">
      <PageTitle title="Event types" />

      <ErrorAlert isError={isError} error={error} />

      {isPending ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader size="lg" color="black" />
        </div>
      ) : events?.length === 0 ? (
        <div>
          <EmptyState />
        </div>
      ) : (
        <div className="w-full">
          <UserSection username={username} />
          <EventListSection events={events} username={username} />
        </div>
      )}
    </div>
  );
};

export default EventType;
