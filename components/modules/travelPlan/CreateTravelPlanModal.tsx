"use client";

import { createTravelPlan } from "@/services/travelPlan/travelPlan.service";
import { TravelType, Visibility } from "@/types/travelPlan.types";
import { Loader2, Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
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

export function CreateTravelPlanModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createTravelPlan, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Travel plan created successfully!");
      setOpen(false);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Create a New Travel Plan
          </DialogTitle>
          <DialogDescription>
            Manually create a travel plan and add your own budget and timeline.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination.country">Country *</Label>
              <Input
                id="destination.country"
                name="destination.country"
                placeholder="e.g. France"
                required
              />
              <InputFieldError
                messages={state?.errors?.["destination.country"]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination.city">City</Label>
              <Input
                id="destination.city"
                name="destination.city"
                placeholder="e.g. Paris"
              />
              <InputFieldError messages={state?.errors?.["destination.city"]} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" name="startDate" type="date" required />
              <InputFieldError messages={state?.errors?.startDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input id="endDate" name="endDate" type="date" required />
              <InputFieldError messages={state?.errors?.endDate} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Total Days *</Label>
            <Input
              id="days"
              name="days"
              type="number"
              min="1"
              placeholder="e.g. 5"
              required
            />
            <InputFieldError messages={state?.errors?.days} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Min Budget ($) *</Label>
              <Input
                id="budgetMin"
                name="budgetMin"
                type="number"
                min="0"
                placeholder="e.g. 500"
                required
              />
              <InputFieldError messages={state?.errors?.budgetMin} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">Max Budget ($) *</Label>
              <Input
                id="budgetMax"
                name="budgetMax"
                type="number"
                min="0"
                placeholder="e.g. 2000"
                required
              />
              <InputFieldError messages={state?.errors?.budgetMax} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelType">Travel Type</Label>
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

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
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

          <Button type="submit" className="w-full mt-6" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
