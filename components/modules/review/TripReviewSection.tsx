"use client";

import { getInitials } from "@/lib/helpers";
import { getTripReviews } from "@/services/review/review.service";
import { IReview } from "@/types/review.types";
import { ITripPerson } from "@/types/trip.types";
import { CheckCircle2, Loader2, MessageSquareHeart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ReviewFormDialog } from "./ReviewFormDialog";
import { StarRatingDisplay } from "./StarRating";

interface TripReviewSectionProps {
  tripId: string;
  currentUserId?: string;
  /** Everyone on the trip except the current user (host + members). */
  companions: ITripPerson[];
}

/**
 * Shown once a trip is marked complete. Lets the current user rate and
 * review each of their travel companions, and switches a companion's row
 * to "edit" mode once they've already left a review.
 */
export function TripReviewSection({
  tripId,
  currentUserId,
  companions,
}: TripReviewSectionProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTripReviews(tripId).then((data) => {
      if (!cancelled) {
        setReviews(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  if (companions.length === 0) return null;

  const myReviewFor = (personId: string) =>
    reviews.find(
      (r) => r.reviewer._id === currentUserId && r.reviewee._id === personId,
    );

  const reviewedCount = companions.filter((c) =>
    myReviewFor(c._id),
  ).length;

  return (
    <div className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <MessageSquareHeart className="w-3.5 h-3.5 text-primary" />
          Rate your companions
        </p>
        {!loading && (
          <span className="text-xs font-medium text-muted-foreground">
            {reviewedCount}/{companions.length} reviewed
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Loading review status…
        </div>
      ) : (
        <ul className="space-y-2">
          {companions.map((person) => {
            const myReview = myReviewFor(person._id);
            return (
              <li
                key={person._id}
                className="flex items-center gap-2.5 rounded-lg bg-card/60 border border-border/30 p-2"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                  {person.picture ? (
                    <Image
                      src={person.picture}
                      alt={person.name}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10 text-[10px]">
                      {getInitials(person.name)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">
                    {person.name}
                  </p>
                  {myReview && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRatingDisplay value={myReview.rating} size={11} />
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    </div>
                  )}
                </div>
                <ReviewFormDialog
                  tripId={tripId}
                  reviewee={person}
                  existingReview={myReview}
                  onSuccess={(review) =>
                    setReviews((prev) => {
                      const withoutOld = prev.filter(
                        (r) => r._id !== review._id,
                      );
                      return [...withoutOld, review];
                    })
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
