"use client";

import { useActionState, useEffect, useState } from "react";
import { Edit3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateTravelPlan } from "@/services/travelPlan/travelPlan.service";
import { ITravelPlan, TravelType, Visibility } from "@/types/travelPlan.types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputFieldError from "@/components/ui/InputFieldError";

export function EditTravelPlanModal({ plan }: { plan: ITravelPlan }) {
  const [open, setOpen] = useState(false);
  const updateWithId = updateTravelPlan.bind(null, plan._id);
  const [state, formAction, isPending] = useActionState(updateWithId, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Travel plan updated successfully!");
      setOpen(false);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  const startDateStr = new Date(plan.startDate).toISOString().split('T')[0];
  const endDateStr = new Date(plan.endDate).toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Edit3 className="w-3.5 h-3.5 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
              <Input id="edit-country" name="destination.country" defaultValue={plan.destination.country} required />
              <InputFieldError messages={state?.errors?.["destination.country"]} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input id="edit-city" name="destination.city" defaultValue={plan.destination.city} />
              <InputFieldError messages={state?.errors?.["destination.city"]} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date</Label>
              <Input id="edit-startDate" name="startDate" type="date" defaultValue={startDateStr} required />
              <InputFieldError messages={state?.errors?.startDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate">End Date</Label>
              <Input id="edit-endDate" name="endDate" type="date" defaultValue={endDateStr} required />
              <InputFieldError messages={state?.errors?.endDate} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-days">Total Days</Label>
            <Input id="edit-days" name="days" type="number" min="1" defaultValue={plan.days} required />
            <InputFieldError messages={state?.errors?.days} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-budgetMin">Min Budget ($)</Label>
              <Input id="edit-budgetMin" name="budgetMin" type="number" min="0" defaultValue={plan.budgetMin} required />
              <InputFieldError messages={state?.errors?.budgetMin} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-budgetMax">Max Budget ($)</Label>
              <Input id="edit-budgetMax" name="budgetMax" type="number" min="0" defaultValue={plan.budgetMax} required />
              <InputFieldError messages={state?.errors?.budgetMax} />
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
