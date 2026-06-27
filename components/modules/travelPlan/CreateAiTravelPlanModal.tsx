"use client";

import { useActionState, useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateAiTravelPlan } from "@/services/travelPlan/travelPlan.service";
import { TravelType, Visibility } from "@/types/travelPlan.types";

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

export function CreateAiTravelPlanModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(generateAiTravelPlan, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("AI travel plan generated successfully!");
      setOpen(false);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Sparkles className="w-5 h-5 mr-2 text-violet-500" />
            AI Travel Planner
          </DialogTitle>
          <DialogDescription>
            Let our AI craft the perfect itinerary for your next adventure.
          </DialogDescription>
        </DialogHeader>
        
        <form action={formAction} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="destination.country">Country</Label>
            <Input id="destination.country" name="destination.country" placeholder="e.g. Japan" required />
            <InputFieldError messages={state?.errors?.["destination.country"]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination.city">City (Optional)</Label>
            <Input id="destination.city" name="destination.city" placeholder="e.g. Tokyo" />
            <InputFieldError messages={state?.errors?.["destination.city"]} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" required />
              <InputFieldError messages={state?.errors?.startDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" required />
              <InputFieldError messages={state?.errors?.endDate} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days">Days</Label>
              <Input id="days" name="days" type="number" min="1" placeholder="e.g. 7" required />
              <InputFieldError messages={state?.errors?.days} />
            </div>
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

          <Button type="submit" className="w-full mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating magic...
              </>
            ) : (
              "Generate Plan"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
