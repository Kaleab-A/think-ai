import eventImage from "@/assets/event-type.svg";
import NewEventDialog from "./new-event-dialog";

const EmptyState = () => {
  return (
    <div
      className="flex flex-col items-center justify-center
     h-full p-[50px_0_50px_0] text-center"
    >
      <img
        src={eventImage}
        alt={"Create events"}
        className="w-[100px] h-[100px] mb-3"
      />
      <h3 className="text-xl mb-[3px] font-semibold">
        Create scheduling links with event types
      </h3>
      <p className="font-light">
        Create event for schedule meetings like customer calls, and more.
      </p>

      <div className="mt-5">
        <NewEventDialog btnVariant="default" />
      </div>
    </div>
  );
};

export default EmptyState;
