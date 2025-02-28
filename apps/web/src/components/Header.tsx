import { ChevronDown, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex min-h-12 pt-3 shrink-0 items-center transition-[width,height] ease-linear">
      <div className="w-full flex items-center justify-end !px-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 !cursor-pointer">
              <Avatar className="!active:border-1 active:border-primary">
                <AvatarFallback className="bg-[#e7edf6]">E</AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 !fill-black" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="!w-[280px] !rounded-[6px] !p-[8px_0] bg-white border border-[#D4E114]"
            style={{
              boxShadow: "0 1px 5px rgba(0, 74, 16, 0.15)",
            }}
          >
            <div
              role="menu"
              style={{
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
              }}
            >
              <div className="!pb-2">
                <div className="flex flex-col !p-[8px_16px] text-xl font-bold">
                  <h3>Emmanuel Umeh </h3>
                  <p className="text-[#476788] !text-sm !font-normal">
                    Teams free trial
                  </p>
                </div>
              </div>
              <Separator />
              <div className="!pt-2">
                <div className="!p-[12px_16px_4px]">
                  <h3 className="text-xs font-bold !tracking-[0.1em] text-[rgba(26,26,26,0.61)] uppercase">
                    Account setting
                  </h3>
                </div>

                <Link
                  to="#"
                  role="menuitem"
                  className="!p-[12px_16px] font-bold text-sm !text-[#0a2540] 
                  flex items-center gap-2 hover:!bg-[#e5efff]"
                >
                  <LogOutIcon className="w-4 h-4 transform rotate-180 !stroke-2" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
