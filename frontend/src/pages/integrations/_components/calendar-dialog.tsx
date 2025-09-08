import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCalendarsQueryFn, saveSelectedCalendarsMutationFn } from "@/lib/api";
import { IntegrationAppType } from "@/lib/types";
import { Loader } from "@/components/loader";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/ErrorAlert";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appType: IntegrationAppType;
}

interface CalendarItem {
  id: string;
  summary?: string;
  selected: boolean;
}

export default function CalendarDialog({ open, onOpenChange, appType }: CalendarDialogProps) {
  const queryClient = useQueryClient();
  const { data, isFetching, isError, error } = useQuery<{ calendars: CalendarItem[] }>({
    enabled: open,
    queryKey: ["calendars", appType],
    queryFn: () => listCalendarsQueryFn(appType),
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // update local state when data loads
  const calendars = data?.calendars || [];
  React.useEffect(() => {
    if (open && calendars.length) {
      setSelectedIds(calendars.filter((c) => c.selected).map((c) => c.id));
    }
  }, [open, calendars]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ ids }: { ids: string[] }) => saveSelectedCalendarsMutationFn({ appType, ids }),
    onSuccess: () => {
      toast.success("Calendar selection saved");
      queryClient.invalidateQueries({ queryKey: ["calendars", appType] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save selection");
    },
  });

  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    mutate({ ids: selectedIds });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select calendars to check for conflicts</DialogTitle>
        </DialogHeader>
        {isFetching ? (
          <div className="flex items-center justify-center py-10">
            <Loader size="lg" color="black" />
          </div>
        ) : isError ? (
          <ErrorAlert isError error={error} />
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2">
            {calendars.map((c) => (
              <label key={c.id} className="flex items-center gap-3">
                <Checkbox
                  checked={selectedIds.includes(c.id)}
                  onCheckedChange={() => toggleId(c.id)}
                />
                <span>{c.summary || c.id}</span>
              </label>
            ))}
          </div>
        )}
        <DialogFooter className="pt-4">
          <Button disabled={isPending} onClick={handleSave}>
            {isPending ? <Loader size="sm" color="white" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 