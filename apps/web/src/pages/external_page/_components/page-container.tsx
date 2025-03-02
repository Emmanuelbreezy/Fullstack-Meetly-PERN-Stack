import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

const PageContainer = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { children, className } = props;
  return (
    <div className="w-full">
      <div className="flex items-center justify-center mt-[66px] mb-[30px]">
        <Card
          className={cn(
            `booking--card w-full md:min-w-[900px] md:max-w-[1000px] min-h-[540px]
        mx-auto shadow-[0px_1px_8px_0px_rgba(0,0,0,0.08)] 
        border border-[rgba(26,26,26,0.1)] rounded-lg
        `,
            className && className
          )}
        >
          <CardContent className="relative py-0 px-0">
            <a
              href="/"
              target="_blank"
              className="absolute top-[-1px] right-[-5px] z-10 w-[100px] h-[100px] pointer-events-none will-change-transform overflow-hidden no-underline transition-all duration-100 ease-in"
            >
              <div
                className="relative top-[21px] left-[-11px] z-10 block w-[160px] bg-[rgb(80,89,96)] text-white 
               shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] 
              font-bold leading-[1.2] text-center pointer-events-auto 
              rotate-45 py-[3px] pt-2 px-0 
              no-underline transition-all duration-100 ease-in"
              >
                <div className="text-[8px] -ml-[19px] text-[#F2F2F2] uppercase">
                  powered by
                </div>
                <div className="text-lg -ml-[19px] font-semibold">Meetly</div>
              </div>
            </a>

            <div>{children}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageContainer;
