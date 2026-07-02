import { getInitials } from "@/lib/helpers";
import { IReview } from "@/types/review.types";
import Image from "next/image";
import { StarRatingDisplay } from "./StarRating";

export function ReviewCard({ review }: { review: IReview }) {
  return (
    <div className="group relative p-5 rounded-2xl bg-muted/40 border border-border/40 hover:border-border/80 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
          {review.reviewer.picture ? (
            <Image
              src={review.reviewer.picture}
              alt={review.reviewer.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10 text-sm">
              {getInitials(review.reviewer.name)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate">
            {review.reviewer.name}
          </p>
          <StarRatingDisplay value={review.rating} size={14} />
        </div>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed">
        {review.comment}
      </p>

      <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
        {new Date(review.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        {review.isEdited && (
          <span className="italic before:content-['·'] before:mr-1.5">
            edited
          </span>
        )}
      </p>
    </div>
  );
}
