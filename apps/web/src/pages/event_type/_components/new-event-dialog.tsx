import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { locationOptions, VideoConferencingPlatform } from "@/lib/types";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePaths";

type Errortype = {
  googleError: string | null;
  zoomError: string | null;
};

const NewEventDialog = () => {
  const [selectedLocationType, setSelectedLocationType] =
    useState<VideoConferencingPlatform | null>(null);
  const [error, setError] = useState<Errortype>({
    googleError: `Google meet is not connected. 
    <a href=${PROTECTED_ROUTES.INTEGRATIONS} target="_blank" class='underline text-primary'>Visit the integration page</a>  
    to connect your account.`,
    zoomError: null,
  });

  const eventSchema = z.object({
    eventName: z.string().min(1, "Event name is required"),
    duration: z.string().min(1, "Duration is required"),
    description: z.string().optional(),
    locationType: z
      .enum([
        VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR,
        VideoConferencingPlatform.ZOOM_MEETING,
        VideoConferencingPlatform.MICROSOFT_TEAMS,
      ])
      .refine((value) => value !== undefined, {
        message: "Location type is required",
      }),
  });

  type EventFormData = z.infer<typeof eventSchema>;

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: {
      eventName: "",
      duration: "",
      description: "",
    },
  });

  const { isValid } = form.formState;

  const handleLocationTypeChange = async (value: VideoConferencingPlatform) => {
    setSelectedLocationType(value);
    if (value === VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR) {
      // Check if Google Meet is integrated
      //   const isGoogleMeetIntegrated = await checkGoogleMeetIntegration();
      //   if (!isGoogleMeetIntegrated) {
      //     setGoogleMeetError(
      //       "You must configure your calendar connections to set events to a Google Calendar to host Google Meet web conferences on your events."
      //     );
      //     return;
      //   }
      // }
      //Google meet is not connected. Visit the integration page to connect your account.
      // Clear error and set value in the form
      setError((prev) => ({
        ...prev,
        googleError: null,
      }));
      form.setValue("locationType", value);
    }
  };

  const onSubmit = (data: EventFormData) => {
    console.log("Form Data:", data);
    // Save changes logic here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="!w-auto !border-[#476788] !text-[#0a2540] !font-normal !text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Event Type</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] !px-0 pb-0">
        <DialogHeader className="px-6">
          <DialogTitle className="text-xl">Add a new event type</DialogTitle>
          <DialogDescription>
            Create a new event type for people to book times with.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-6">
              <FormField
                name="eventName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-base">
                      Event name
                    </Label>
                    <FormControl className="mt-2">
                      <Input placeholder="Name your event" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-base">
                      Description
                    </Label>
                    <FormControl className="mt-2">
                      <Textarea
                        className="focus-visible:ring-ring/0"
                        placeholder="Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="duration"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-base">Duration</Label>
                    <FormControl className="mt-2">
                      <Input placeholder="Duration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="locationType"
                control={form.control}
                render={() => (
                  <FormItem>
                    <Label className="font-semibold !text-base">
                      Location Type
                    </Label>
                    <FormControl className="w-full mt-2">
                      <div className="grid grid-cols-4 gap-2">
                        {locationOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={cn(
                              "w-full h-[70px] cursor-pointer border border-[#B2B2B2] mx-auto pt-1 pr-0.5 pl-0.5 rounded-[5px] flex flex-col items-center justify-center",
                              selectedLocationType === option.value &&
                                "border-primary bg-primary/10",
                              !option.isAvailable &&
                                "pointer-events-none !text-gray-400 opacity-80 grayscale",
                              !!error &&
                                "!border-destructive !bg-destructive/10"
                            )}
                            onClick={() =>
                              handleLocationTypeChange(option.value)
                            }
                          >
                            <img
                              src={option.logo}
                              alt={option.label}
                              width="20px"
                              height="20px"
                            />
                            <span className="mt-1 text-sm">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </FormControl>

                    {error?.googleError ? (
                      <FormMessage>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: error.googleError,
                          }}
                        />
                      </FormMessage>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter
              className="bg-[#f6f7f9] border-t px-6 py-3 !mt-6
             border-[#e5e7eb] rounded-b-[8px]"
            >
              <Button type="submit" disabled={!isValid}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventDialog;
