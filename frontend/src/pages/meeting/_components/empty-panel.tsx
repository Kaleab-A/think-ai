import emptyImage from "@/assets/no-events.svg";

const EmptyPanel = (props: { title: string }) => {
  const { title = "No Upcoming Events" } = props;
  return (
    <div
      className="flex flex-col items-center justify-center
     h-full p-[50px_0_50px_0] text-center"
    >
      <img src={emptyImage} alt={title} className="w-[120px] h-[120px] mb-1" />
      <h3 className="text-xl mb-[12px] font-bold opacity-90 text-[#476788]">
        {title}
      </h3>
    </div>
  );
};

export default EmptyPanel;
