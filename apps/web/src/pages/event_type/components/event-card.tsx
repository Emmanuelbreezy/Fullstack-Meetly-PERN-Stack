import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronDown, CopyIcon, Settings } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface PropsType {
  active: boolean;
}

const EventCard: FC<PropsType> = ({ active = false }) => {
  return (
    <div>
      <Card
        className={cn(
          `!p-0 !ring-0 w-full max-w-[400px]
        box-border min-h-[220px] border border-[#CCCCCC)] bg-white rounded-[4px]
        shadow-[0_1px_6px_0_rgb(0_0_0_/_10%)]`,
          !active && "bg-transparent"
        )}
      >
        <CardContent className="relative flex flex-col p-0">
          <div
            className={cn(
              `bg-[rgb(130,71,245)]
          h-[6px] -mt-[1px] -mr-[1px] -ml-[1px] rounded-tl-[4px] rounded-tr-[4px]
          `,
              !active && "bg-[#B2B2B2]"
            )}
          ></div>
          <div className="flex items-center justify-between p-[12px_16px]">
            <div>
              <label htmlFor="">
                <Checkbox id="" />
              </label>
            </div>
            <button className="flex items-center gap-px">
              <span>
                <Settings className="w-[17px] h-[17px]" />
              </span>
              <ChevronDown className="!w-3 !h-3 !fill-black" />
            </button>
          </div>

          {/* {Event details} */}
          <div className="w-full flex flex-col p-[5px_16px_18px_16px]">
            <h2
              className={cn(
                `text-lg font-normal`,
                !active && "text-[rgba(26,26,26,0.61)]"
              )}
            >
              my new one
            </h2>
            <p className="text-[#476788]">30 min, One-on-One</p>
            <Link
              target="_blank"
              to={`/techwithemma/my-new-one-234?preview_src=et_card`}
              rel="noopener noreferrer"
              className={cn(
                `pt-2 text-[#004eba]`,
                !active && "pointer-events-none opacity-60"
              )}
            >
              View booking page
            </Link>
          </div>
        </CardContent>
        <CardFooter
          className="p-[12px_8px_12px_16px] 
        border-t border-[#D4E162] h-full flex items-center justify-between"
        >
          <Button
            variant="ghost"
            disabled={!active}
            className="flex items-center gap-2 cursor-pointer font-light text-sm text-[rgb(0,105,255)]
            disabled:text-[rgba(26,26,26,0.61)] disabled:bg-[#e7edf6] disabled:opacity-100
                      "
          >
            <CopyIcon className="w-4 h-4" />
            <span>Copy link</span>
          </Button>

          <Button
            variant="outline"
            className={cn(
              "!p-[8px_16px] text-sm font-normal !h-auto cursor-pointer",
              !active && "!border-[#476788] !text-[#0a2540] z-30 "
            )}
          >
            <span>Turn {active ? "Off" : "On"}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventCard;
