"use client";

import { updateTravelPlan } from "@/services/travelPlan/travelPlan.service";
import { ITravelPlan, TravelType, Visibility } from "@/types/travelPlan.types";
import { Edit3, GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
export function EditTravelPlanModal({ plan }: { plan: ITravelPlan }) {
  const [open, setOpen] = useState(false);
  const updateWithId = updateTravelPlan.bind(null, plan._id);
  const [state, formAction, isPending] = useActionState(updateWithId, null);

  const startDateStr = new Date(plan.startDate).toISOString().split("T")[0];
  const endDateStr = new Date(plan.endDate).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(startDateStr);
  const [endDate, setEndDate] = useState(endDateStr);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    () =>
      plan.itinerary?.map((day) => ({
        id: crypto.randomUUID(),
        day: day.day,
        title: day.title,
        activities: [...day.activities],
      })) ?? [],
  );
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
    if (!state?.success) return;

    toast.success("Travel plan updated successfully.");

    queueMicrotask(() => {
      setOpen(false);
    });
  }, [state]);
  const addDay = () =>
    setItinerary((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        day: prev.length + 1,
        title: "",
        activities: [""],
      },
    ]);

  const removeDay = (id: string) =>
    setItinerary((prev) =>
      prev
        .filter((d) => d.id !== id)
        .map((d, i) => ({
          ...d,
          day: i + 1,
        })),
    );

  const updateDayTitle = (id: string, title: string) =>
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              title,
            }
          : d,
      ),
    );

  const addActivity = (id: string) =>
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              activities: [...d.activities, ""],
            }
          : d,
      ),
    );

  const updateActivity = (id: string, activityIndex: number, value: string) =>
    setItinerary((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;

        const activities = [...d.activities];
        activities[activityIndex] = value;

        return {
          ...d,
          activities,
        };
      }),
    );

  const removeActivity = (id: string, activityIndex: number) =>
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              activities: d.activities.filter((_, i) => i !== activityIndex),
            }
          : d,
      ),
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Edit3 className="w-3.5 h-3.5 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Travel Plan</DialogTitle>
          <DialogDescription>
            Make changes to your travel plan details.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                name="destination.country"
                defaultValue={plan.destination.country}
                required
              />
              <InputFieldError field="destination.country" state={state} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                name="destination.city"
                defaultValue={plan.destination.city}
              />
              <InputFieldError field="destination.city" state={state} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <InputFieldError field="startDate" state={state} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate">End Date</Label>
              <Input
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <InputFieldError field="endDate" state={state} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-days">Total Days</Label>
            <Input name="days" value={days} readOnly />
            <InputFieldError field="days" state={state} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-budgetMin">Min Budget ($)</Label>
              <Input
                id="edit-budgetMin"
                name="budgetMin"
                type="number"
                min="0"
                defaultValue={plan.budgetMin ?? ""}
                required
              />
              <InputFieldError field="budgetMin" state={state} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-budgetMax">Max Budget ($)</Label>
              <Input
                id="edit-budgetMax"
                name="budgetMax"
                type="number"
                min="0"
                defaultValue={plan.budgetMax ?? ""}
                required
              />

              <InputFieldError field="budgetMax" state={state} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-travelType">Travel Type</Label>
              <Select name="travelType" defaultValue={plan.travelType}>
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

            <div className="space-y-2">
              <Label htmlFor="edit-visibility">Visibility</Label>
              <Select name="visibility" defaultValue={plan.visibility}>
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Itinerary</h4>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDay}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Day
              </Button>
            </div>

            {itinerary.map((day, dayIdx) => (
              <div key={day.id} className="rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 border-b px-3 py-2">
                  <span className="rounded bg-primary/10 px-2 py-1 text-xs">
                    Day {day.day}
                  </span>

                  <Input
                    className="flex-1 border-0 bg-transparent"
                    value={day.title}
                    onChange={(e) => updateDayTitle(day.id, e.target.value)}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDay(day.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 p-3">
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex gap-2">
                      <GripVertical className="mt-2 h-4 w-4 text-muted-foreground" />

                      <Input
                        value={activity}
                        onChange={(e) =>
                          updateActivity(day.id, activityIndex, e.target.value)
                        }
                      />

                      {day.activities.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeActivity(day.id, activityIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addActivity(day.id)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Activity
                  </Button>

                  <InputFieldError
                    field={`itinerary.${dayIdx}.activities`}
                    state={state}
                  />
                </div>
              </div>
            ))}
          </div>
          <input
            type="hidden"
            name="itinerary"
            value={JSON.stringify(
              itinerary.map((day) => ({
                day: day.day,
                title: day.title,
                activities: day.activities.filter((a) => a.trim()),
              })),
            )}
          />

          <Button type="submit" className="w-full mt-6" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
