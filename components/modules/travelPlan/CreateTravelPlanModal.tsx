/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { createTravelPlan } from "@/services/travelPlan/travelPlan.service";
import { TravelType, Visibility } from "@/types/travelPlan.types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputFieldError from "@/components/ui/InputFieldError";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  activities: string[];
}

function createDay(index: number): ItineraryDay {
  return {
    id: crypto.randomUUID(),
    day: index + 1,
    title: "",
    activities: [""],
  };
}

export function CreateTravelPlanModal() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  const [state, formAction, isPending] = useActionState(createTravelPlan, null);
  console.log({ state });

  const days = useMemo(() => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return "";
    return (
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    ).toString();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!state) return;
    if (!state.success) {
      console.log("State false");
      if (state.message) toast.error(state.message);
      return;
    }
    toast.success("Travel plan created successfully.");
    router.push(`/user/travel-plans`);
  }, [state, router]);
  const handledStateRef = useRef<typeof state>(null);
  useEffect(() => {
    if (!state || state === handledStateRef.current) return;
    handledStateRef.current = state;

    if (!state.success) {
      if (state.message) toast.error(state.message);
      return;
    }

    toast.success("Travel plan created successfully.");
    router.push(`/user/travel-plans/${state.data._id}/edit`);
  }, [state, router]);

  // ── Itinerary helpers ──
  const addDay = () =>
    setItinerary((prev) => [...prev, createDay(prev.length)]);

  const removeDay = (id: string) =>
    setItinerary((prev) =>
      prev.filter((d) => d.id !== id).map((d, i) => ({ ...d, day: i + 1 })),
    );

  const updateDayTitle = (id: string, title: string) =>
    setItinerary((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title } : d)),
    );

  const addActivity = (id: string) =>
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, activities: [...d.activities, ""] } : d,
      ),
    );

  const updateActivity = (id: string, idx: any, value: any) =>
    setItinerary((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const activities = [...d.activities];
        activities[idx] = value;
        return { ...d, activities };
      }),
    );

  const removeActivity = (id: string, idx: any) =>
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, activities: d.activities.filter((_, i) => i !== idx) }
          : d,
      ),
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Travel Plan</DialogTitle>
          <DialogDescription>
            Create your travel plan first. You can build the itinerary on the
            next page.
          </DialogDescription>
        </DialogHeader>

        <form
          action={formAction}
          className="flex flex-1 flex-col gap-6 overflow-y-auto pr-1"
        >
          {/* Destination */}
          <div className="space-y-3">
            <h4 className="font-medium">Destination</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input name="destination.country" placeholder="Japan" />
                <InputFieldError field="destination.country" state={state} />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input name="destination.city" placeholder="Tokyo" />
                <InputFieldError field="destination.city" state={state} />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h4 className="font-medium">Travel Dates</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <InputFieldError field="startDate" state={state} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <InputFieldError field="endDate" state={state} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Total Days</Label>
              <Input name="days" value={days} readOnly />
              <InputFieldError field="days" state={state} />
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <h4 className="font-medium">Budget</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Minimum Budget ($)</Label>
                <Input
                  type="number"
                  name="budgetMin"
                  min={0}
                  placeholder="1000"
                />
                <InputFieldError field="budgetMin" state={state} />
              </div>
              <div className="space-y-1.5">
                <Label>Maximum Budget ($)</Label>
                <Input
                  type="number"
                  name="budgetMax"
                  min={0}
                  placeholder="2500"
                />
                <InputFieldError field="budgetMax" state={state} />
              </div>
            </div>
          </div>

          {/* Travel Type + Visibility */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Travel Type</Label>
              <Select name="travelType" defaultValue={TravelType.SOLO}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TravelType.SOLO}>Solo</SelectItem>
                  <SelectItem value={TravelType.FAMILY}>Family</SelectItem>
                  <SelectItem value={TravelType.FRIENDS}>Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select name="visibility" defaultValue={Visibility.PUBLIC}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Visibility.PUBLIC}>Public</SelectItem>
                  <SelectItem value={Visibility.PRIVATE}>Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Itinerary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Itinerary</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDay}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Day
              </Button>
            </div>

            {itinerary.length === 0 ? (
              <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                No days added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {itinerary.map((day, dayIdx) => (
                  <div key={day.id} className="rounded-lg border bg-muted/30">
                    {/* Day header */}
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        Day {day.day}
                      </span>
                      <Input
                        className="h-7 flex-1 border-0 bg-transparent px-1 text-sm font-medium shadow-none focus-visible:ring-0"
                        placeholder="Day title"
                        value={day.title}
                        onChange={(e) => updateDayTitle(day.id, e.target.value)}
                        name={`itinerary[${dayIdx}].title`}
                      />
                      <button
                        type="button"
                        onClick={() => removeDay(day.id)}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove day"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Activities */}
                    <div className="space-y-1.5 p-3">
                      {day.activities.map((act, actIdx) => (
                        <div key={actIdx} className="flex items-center gap-2">
                          <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                          <Input
                            className="h-8 flex-1 text-sm"
                            placeholder={`Activity ${actIdx + 1}`}
                            value={act}
                            onChange={(e) =>
                              updateActivity(day.id, actIdx, e.target.value)
                            }
                            name={`itinerary[${dayIdx}].activities[${actIdx}]`}
                          />
                          {day.activities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeActivity(day.id, actIdx)}
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Remove activity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addActivity(day.id)}
                        className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Plus className="h-3 w-3" />
                        Add activity
                      </button>
                    </div>
                    <InputFieldError
                      field={`itinerary.${dayIdx}.activities`}
                      state={state}
                    />
                  </div>
                ))}
              </div>
            )}

            <input
              type="hidden"
              name="itinerary"
              value={JSON.stringify(
                itinerary.map((d) => ({
                  day: d.day,
                  title: d.title,
                  activities: d.activities.filter((a) => a.trim()),
                })),
              )}
            />
          </div>

          <Button className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Travel Plan"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
