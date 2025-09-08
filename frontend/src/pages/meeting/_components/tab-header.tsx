import useMeetingFilter from "@/hooks/use-meeting-filter";

const TabHeader = () => {
  const { PeriodEnum, period, setPeriod } = useMeetingFilter();

  return (
    <div className="filter--list w-full flex items-center">
      <div className="!p-[16px_24px_0_24px] flex-1">
        <ul className="flex items-center gap-8 text-base h-[48px]">
          <li
            className={`h-full ${
              period === PeriodEnum.UPCOMING
                ? "border-b-[3px] border-[#006bff]"
                : ""
            }`}
          >
            <button
              className="p-[7px_0_14px] cursor-pointer text-[#0a2540]"
              onClick={() => setPeriod(PeriodEnum.UPCOMING)}
            >
              Upcoming
            </button>
          </li>
          <li
            className={`h-full ${
              period === PeriodEnum.PAST
                ? "border-b-[3px] border-[#006bff]"
                : ""
            }`}
          >
            <button
              className="p-[7px_0_14px] cursor-pointer text-[#0a2540]"
              onClick={() => setPeriod(PeriodEnum.PAST)}
            >
              Past
            </button>
          </li>
          <li
            className={`h-full ${
              period === PeriodEnum.CANCELLED
                ? "border-b-[3px] border-[#006bff]"
                : ""
            }`}
          >
            <button
              className="p-[7px_0_14px] cursor-pointer text-[#0a2540]"
              onClick={() => setPeriod(PeriodEnum.CANCELLED)}
            >
              Cancelled
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TabHeader;
