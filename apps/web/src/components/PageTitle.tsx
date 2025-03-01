import { HelpCircleIcon } from "lucide-react";

const PageTitle = (props: { title: string }) => {
  const { title } = props;
  return (
    <div className="w-full flex items-center gap-2 min-h-[71px]">
      <h1 className="text-3xl font-bold text-[#0a2540]">{title}</h1>
      <HelpCircleIcon className="w-4 h-4" />
    </div>
  );
};

export default PageTitle;
