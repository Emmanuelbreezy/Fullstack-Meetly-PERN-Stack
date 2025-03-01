import PageTitle from "@/components/PageTitle";
import IntegrationCard from "./_components/integration-card";
import { IntegrationTitleType, IntegrationType } from "@/lib/types";

type IntegrationDataType = {
  app_type: IntegrationType;
  title: IntegrationTitleType;
  provider: string;
  category: string;
  isDisabled: boolean;
  isConnected: boolean;
};

const Integrations = () => {
  const dummyIntegrations: IntegrationDataType[] = [
    {
      app_type: "GOOGLE_MEET",
      title: "Google Meet",
      provider: "Google",
      category: "VIDEO_CONFERENCING",
      isDisabled: false,
      isConnected: false,
    },
    {
      app_type: "GOOGLE_CALENDAR",
      title: "Google Calendar",
      provider: "Google",
      category: "CALENDAR",
      isDisabled: false,
      isConnected: false,
    },
    {
      app_type: "ZOOM_MEETING",
      title: "Zoom",
      provider: "Zoom",
      category: "VIDEO_CONFERENCING",
      isDisabled: false,
      isConnected: false,
    },
    {
      app_type: "OUTLOOK_CALENDAR",
      title: "Outlook Calendar",
      provider: "Microsoft",
      category: "CALENDAR",
      isDisabled: true,
      isConnected: false,
    },
    {
      app_type: "MICROSOFT_TEAMS",
      title: "Microsoft Teams",
      provider: "Microsoft",
      category: "VIDEO_CONFERENCING",
      isDisabled: true,
      isConnected: false,
    },
  ];

  const groupIntegrationsByCategory = (
    integrations: IntegrationDataType[]
  ): Record<string, IntegrationDataType[]> =>
    integrations.reduce((acc, { category, ...rest }) => {
      (acc[category] ||= []).push({ category, ...rest });
      return acc;
    }, {} as Record<string, IntegrationDataType[]>);

  const groupedIntegrations = groupIntegrationsByCategory(dummyIntegrations);

  return (
    <div className="flex flex-col !gap-5">
      <PageTitle
        title="Integrations & apps"
        subtitle="Connect all your apps directly from here. You may need to connect
          these apps regularly to refresh verification"
      />

      <div className="relative flex flex-col gap-4">
        <section className="flex flex-col gap-4 text-muted-foreground">
          {Object.entries(groupedIntegrations).map(
            ([category, integrations]) => (
              <div key={category} className="mb-2">
                <h2 className="mb-4 text-[15px] font-bold capitalize">
                  {category.replace("_", " ")}
                </h2>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <IntegrationCard
                      key={integration.app_type}
                      isDisabled={integration.isDisabled}
                      appType={integration.app_type}
                      title={integration.title}
                      isConnected={integration.isConnected}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
};

export default Integrations;
