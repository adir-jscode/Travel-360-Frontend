/**
 * A lightweight populated-user shape, matching
 * `.populate([{ path: 'reviewer', select: 'name picture' }, { path: 'reviewee', select: 'name picture' }])`
 * on the backend.
 */
export interface IReviewPerson {
  _id: string;
  name: string;
  picture?: string;
}

/**
 * Mirrors the backend `IReview` model. A review is always scoped to a trip
 * that both the reviewer and reviewee were members of.
 */
export interface IReview {
  _id: string;
  reviewer: IReviewPerson;
  reviewee: IReviewPerson;
  trip: string;
  rating: number; // 1–5
  comment: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** Payload for `POST /review`. */
export interface ICreateReviewPayload {
  reviewee: string;
  trip: string;
  rating: number;
  comment: string;
}

/** Payload for `PATCH /review/:id`. */
export interface IUpdateReviewPayload {
  rating?: number;
  comment?: string;
}
