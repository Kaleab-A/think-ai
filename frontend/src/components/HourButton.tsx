import { Button } from "./ui/button";

interface HourButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const HourButton = ({ label, isActive, onClick }: HourButtonProps) => {
  return (
    <div className="py-2 mx-1">
      <Button
        variant="unstyled"
        size="sm"
        type="button"
        onClick={onClick}
        className={`!px-3 w-full !py-1 !h-full  cursor-pointer rounded-md text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-primary text-white"
            : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
      >
        {label}
      </Button>
    </div>
  );
};

export default HourButton;
