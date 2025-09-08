import { HelpCircleIcon } from "lucide-react";

const PageTitle = (props: { title: string; subtitle?: string }) => {
  const { title, subtitle } = props;
  return (
    <div className="min-h-[71px]">
      <div className="w-full flex items-center gap-2 mb-1">
        <h1 className="text-3xl font-bold text-[#0a2540]">{title}</h1>
        <HelpCircleIcon className="w-4 h-4" />
      </div>
      {subtitle && <p className="text-base font-normal">{subtitle}</p>}
    </div>
  );
};

export default PageTitle;
