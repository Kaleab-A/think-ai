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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { checkIntegrationQueryFn, CreateEventMutationFn, getAllIntegrationQueryFn } from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "@/components/loader";

const NewEventDialog = (props: { btnVariant?: string }) => {
  const { btnVariant } = props;

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: CreateEventMutationFn,
  });

  const [selectedLocationType, setSelectedLocationType] =
    useState<VideoConferencingPlatform | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [appConnected, setAppConnected] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    data: integrationData,
    isFetching: integrationsFetching,
  } = useQuery({
    queryKey: ["integration_list_dialog"],
    queryFn: getAllIntegrationQueryFn,
  });

  const connectedSet = new Set<string>(
    integrationData?.integrations
      ?.filter((i) => i.isConnected)
      .map((i) => i.app_type) || []
  );

  const eventSchema = z.object({
    title: z.string().min(1, "Event name is required"),
    duration: z
      .number()
      .int({ message: "Duration must be a number" })
      .min(1, "Duration is required"),
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
      title: "",
      duration: 30,
      description: "",
    },
  });

  const { isValid } = form.formState;

  const handleLocationTypeChange = async (value: VideoConferencingPlatform) => {
    setSelectedLocationType(value);
    setAppConnected(false);

    if (value === VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR) {
      setIsChecking(true);
      try {
        const { isConnected } = await checkIntegrationQueryFn(
          VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR
        );

        if (!isConnected) {
          setError(
            `Google Meet is not connected. <a href=${PROTECTED_ROUTES.INTEGRATIONS} target="_blank" class='underline text-primary'>Visit the integration page</a> to connect your account.`
          );
          return;
        }
        setError(null);
        setAppConnected(true);
        form.setValue("locationType", value);
        form.trigger("locationType");
      } catch (error) {
        console.log(error);
        setError("Failed to check Google Meet integration status.");
      } finally {
        setIsChecking(false);
      }
    } else {
      setError(null);
      form.setValue("locationType", value);
    }
  };

  const onSubmit = (data: EventFormData) => {
    console.log("Form Data:", data);
    mutate(
      {
        ...data,
        duration: data.duration,
        description: data.description || "",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["event_list"],
          });
          setSelectedLocationType(null);
          setIsOpen(false);
          setAppConnected(false);
          form.reset();
          toast.success("Event created successfully");
        },
        onError: () => {
          toast.success("Failed to create event");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={btnVariant ? "default" : "outline"}
          size="lg"
          className={cn(
            `!w-auto !border-[#476788] !text-[#0a2540] !font-normal !text-sm`,
            btnVariant && "!text-white !border-primary"
          )}
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
                name="title"
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
                      <Input
                        {...field}
                        type="number"
                        placeholder="Duration"
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value > 0) {
                            field.onChange(parseInt(e.target.value, 10));
                          }
                        }}
                      />
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
                        {locationOptions.map((option) => {
                          const integrated = connectedSet.has(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              className={cn(
                                `w-full h-[70px] cursor-pointer border disabled:pointer-events-none border-[#B2B2B2] mx-auto pt-1 pr-0.5 pl-0.5 rounded-[5px] flex flex-col items-center justify-center`,
                                selectedLocationType === option.value &&
                                  "border-primary bg-primary/10",
                                !integrated &&
                                  "pointer-events-none !text-gray-400 opacity-80 grayscale",
                                selectedLocationType === option.value &&
                                  !!error &&
                                  "!border-destructive !bg-destructive/10",
                                appConnected &&
                                  selectedLocationType === option.value &&
                                  "!border-green-500 !bg-green-50"
                              )}
                              disabled={isChecking || integrationsFetching}
                              onClick={() => {
                                if (!integrated) return;
                                if (
                                  !appConnected &&
                                  selectedLocationType !== option.value
                                ) {
                                  handleLocationTypeChange(option.value);
                                }
                              }}
                            >
                              {isChecking &&
                                selectedLocationType === option.value ? (
                                <Loader size="sm" />
                              ) : (
                                <>
                                  <img
                                    src={option.logo as string}
                                    alt={option.label}
                                    width="20px"
                                    height="20px"
                                  />
                                  <span className="mt-1 text-sm">
                                    {option.label}
                                  </span>
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>

                    {error ? (
                      <FormMessage>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: error,
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
              <Button type="submit" disabled={!isValid || isPending}>
                {isPending ? (
                  <Loader size="sm" color="white" />
                ) : (
                  <span>Create</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventDialog;
