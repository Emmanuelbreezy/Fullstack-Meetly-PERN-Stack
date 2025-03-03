import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IntegrationDescriptions,
  IntegrationLogos,
  IntegrationTitleType,
  IntegrationType,
} from "@/lib/types";

interface IntegrationCardProps {
  appType: IntegrationType;
  title: IntegrationTitleType;
  isConnected?: boolean;
  isDisabled?: boolean;
}

const IntegrationCard = ({
  appType,
  title,
  isConnected = false,
  isDisabled = false,
}: IntegrationCardProps) => {
  const logo = IntegrationLogos[appType];
  const description = IntegrationDescriptions[appType];

  const handleConnect = async () => {};

  return (
    <Card className="flex w-full items-center justify-between shadow-none border-0">
      <CardHeader className="flex flex-col gap-4">
        <div
          className="flex items-center justify-center
           rounded-full size-[50px]"
          style={{
            boxShadow: "0 2px 5px 0 rgb(0 0 0 / 27%)",
          }}
        >
          <img
            src={logo}
            alt={title}
            height={30}
            width={30}
            className="object-cover"
          />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        {isConnected ? (
          <div
            className="inline-flex items-center 
              justify-center min-h-[44px] text-sm
              border border-primary
              text-primary
               p-[8px_16px] rounded-full font-bold w-[180px]"
          >
            Connected
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            variant="unstyled"
            className={`shrink-0 inline-flex items-center 
              justify-center min-h-[44px] text-sm font-semibold
               p-[8px_16px] rounded-full w-[180px]
               ${
                 isDisabled
                   ? "pointer-events-none opacity-80 border border-gray-200 text-muted-foreground bg-transparent"
                   : "bg-primary text-primary-foreground"
               }`}
            aria-disabled={isDisabled}
          >
            {isDisabled ? "Not available" : "Connect"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default IntegrationCard;
