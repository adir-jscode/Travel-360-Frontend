"use client";

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
import InputFieldError from "@/components/ui/InputFieldError";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/helpers";
import { createReview, updateReview } from "@/services/review/review.service";
import { IReview } from "@/types/review.types";
import { Loader2, PenLine, Star } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { StarRatingInput } from "./StarRating";

interface ReviewFormDialogProps {
  tripId: string;
  reviewee: { _id: string; name: string; picture?: string };
  /** Pass the existing review to switch the dialog into edit mode. */
  existingReview?: IReview;
  onSuccess?: (review: IReview) => void;
}

export function ReviewFormDialog({
  tripId,
  reviewee,
  existingReview,
  onSuccess,
}: ReviewFormDialogProps) {
  const isEdit = !!existingReview;
  const action = isEdit ? updateReview : createReview;

  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(action, null);
  const [rating, setRating] = useState(existingReview?.rating ?? 0);

  useEffect(() => {
    if (!open) return;
    setRating(existingReview?.rating ?? 0);
  }, [open, existingReview]);

  useEffect(() => {
    if (state?.success) {
      toast.success(isEdit ? "Review updated!" : "Review submitted — thanks!", {
        description: isEdit
          ? `Your review of ${reviewee.name} has been updated.`
          : `${reviewee.name} will be notified about your review.`,
      });
      onSuccess?.(state.data as IReview);
      setOpen(false);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={
            isEdit
              ? "inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              : "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all duration-200 text-xs font-semibold"
          }
        >
          {isEdit ? (
            <>
              <PenLine className="w-3.5 h-3.5" />
              Edit your review
            </>
          ) : (
            <>
              <Star className="w-3.5 h-3.5" />
              Leave a review
            </>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit your review" : "Rate your trip companion"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update the rating or comment you left for ${reviewee.name}.`
              : `Share how it was traveling with ${reviewee.name}. This helps other travelers trust the community.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-xl bg-muted/40 border border-border/40 p-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
            {reviewee.picture ? (
              <Image
                src={reviewee.picture}
                alt={reviewee.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10 text-sm">
                {getInitials(reviewee.name)}
              </div>
            )}
          </div>
          <p className="font-semibold text-sm">{reviewee.name}</p>
        </div>

        <form action={formAction} className="space-y-5 pt-1">
          <input type="hidden" name="reviewee" value={reviewee._id} />
          <input type="hidden" name="trip" value={tripId} />
          {isEdit && (
            <input type="hidden" name="id" value={existingReview._id} />
          )}

          <div className="space-y-2">
            <Label>Your rating</Label>
            <StarRatingInput value={rating} onChange={setRating} />
            <InputFieldError field="rating" state={state} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your review</Label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              maxLength={1000}
              defaultValue={existingReview?.comment}
              placeholder="How was traveling together? Mention what made them a great (or not-so-great) travel companion…"
              className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30 resize-none"
              required
            />
            <InputFieldError field="comment" state={state} />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEdit ? "Saving…" : "Submitting…"}
                </>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Submit review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
