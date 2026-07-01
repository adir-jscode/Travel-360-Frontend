"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadTripPhotos } from "@/services/trip/trip.service";
import { ITripPhoto } from "@/types/trip.types";
import {
  Camera,
  ImagePlus,
  Images,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface StagedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
}

interface TripPhotoUploadProps {
  tripId: string;
  destination: string;
  existingPhotos?: ITripPhoto[];
}

const MAX_PHOTOS = 5;
const MAX_TOTAL_SIZE_BYTES = 1024 * 1024 * 1024; // 1 GB total across all staged photos
const MAX_TOTAL_SIZE_LABEL = "1 GB";

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(exponent === 0 || value >= 10 ? 0 : 1)} ${units[exponent]}`;
}

/**
 * Lets a trip member (host or companion) upload photos once a trip has been
 * marked complete. Also doubles as a light gallery for anything already
 * uploaded.
 */
export function TripPhotoUpload({
  tripId,
  destination,
  existingPhotos = [],
}: TripPhotoUploadProps) {
  const [open, setOpen] = useState(false);
  const [staged, setStaged] = useState<StagedPhoto[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = MAX_PHOTOS - staged.length;
  const totalStagedBytes = staged.reduce((sum, p) => sum + p.file.size, 0);
  const remainingBytes = Math.max(0, MAX_TOTAL_SIZE_BYTES - totalStagedBytes);
  const sizeLimitReached = remainingBytes <= 0;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);

    let availableSlots = remainingSlots;
    let availableBytes = remainingBytes;

    const accepted: File[] = [];
    let skippedForCount = 0;
    let skippedForSize = 0;

    for (const file of incoming) {
      if (availableSlots <= 0) {
        skippedForCount++;
        continue;
      }
      if (file.size > availableBytes) {
        skippedForSize++;
        continue;
      }
      accepted.push(file);
      availableSlots--;
      availableBytes -= file.size;
    }

    if (skippedForCount > 0) {
      toast.error(`You can stage up to ${MAX_PHOTOS} photos at a time.`);
    }
    if (skippedForSize > 0) {
      toast.error(
        `Skipped ${skippedForSize} photo${skippedForSize === 1 ? "" : "s"} — total uploads can't exceed ${MAX_TOTAL_SIZE_LABEL}.`,
      );
    }

    if (accepted.length === 0) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const newStaged = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      caption: "",
    }));

    setStaged((prev) => [...prev, ...newStaged]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeStaged = (id: string) => {
    setStaged((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updateCaption = (id: string, caption: string) => {
    setStaged((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const resetAndClose = () => {
    staged.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setStaged([]);
    setOpen(false);
  };

  const handleUpload = () => {
    if (staged.length === 0) {
      toast.error("Choose at least one photo to upload.");
      return;
    }

    if (totalStagedBytes > MAX_TOTAL_SIZE_BYTES) {
      toast.error(`Total upload size can't exceed ${MAX_TOTAL_SIZE_LABEL}.`);
      return;
    }

    const formData = new FormData();
    staged.forEach((p) => {
      formData.append("photos", p.file);
      formData.append("captions", p.caption);
    });

    startTransition(async () => {
      const result = await uploadTripPhotos(tripId, null, formData);
      if (result.success) {
        toast.success(
          `${staged.length} photo${staged.length === 1 ? "" : "s"} uploaded!`,
          { description: `Added to your memories from ${destination}.` },
        );
        resetAndClose();
      } else {
        toast.error(
          result.message || "Failed to upload photos. Please try again.",
        );
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? setOpen(true) : resetAndClose())}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-200 text-sm font-semibold"
        >
          <Camera className="w-4 h-4" />
          {existingPhotos.length > 0
            ? `Photos (${existingPhotos.length})`
            : "Add Photos"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Images className="w-5 h-5 text-primary" />
            Trip Photos
          </DialogTitle>
          <DialogDescription>
            Share your favorite moments from {destination} with the group.
          </DialogDescription>
        </DialogHeader>

        {existingPhotos.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Already uploaded
            </p>
            <div className="grid grid-cols-4 gap-2">
              {existingPhotos.map((photo, idx) => (
                <div
                  key={photo._id ?? photo.publicId ?? idx}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || `Trip photo ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Upload new
          </p>

          <label
            htmlFor="trip-photo-input"
            className={`flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed transition-colors ${
              remainingSlots <= 0 || sizeLimitReached
                ? "border-border/40 bg-muted/10 cursor-not-allowed opacity-60"
                : "border-border/60 bg-muted/20 cursor-pointer hover:bg-muted/40 hover:border-primary/40"
            }`}
          >
            <UploadCloud className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {sizeLimitReached
                ? "Size limit reached"
                : "Click to choose photos"}
            </span>
            <span className="text-xs text-muted-foreground">
              Up to {MAX_PHOTOS} images · {MAX_TOTAL_SIZE_LABEL} total · JPG or
              PNG
            </span>
          </label>
          <input
            ref={inputRef}
            id="trip-photo-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={remainingSlots <= 0 || sizeLimitReached || isPending}
            onChange={(e) => handleFiles(e.target.files)}
          />

          {staged.length > 0 && (
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    sizeLimitReached ? "bg-destructive" : "bg-primary"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (totalStagedBytes / MAX_TOTAL_SIZE_BYTES) * 100,
                    )}%`,
                  }}
                />
              </div>
              <p
                className={`text-[11px] ${
                  sizeLimitReached
                    ? "text-destructive font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {formatBytes(totalStagedBytes)} of {MAX_TOTAL_SIZE_LABEL} used
              </p>
            </div>
          )}

          {staged.length > 0 && (
            <div className="space-y-2.5">
              {staged.map((photo) => (
                <div
                  key={photo.id}
                  className="flex gap-3 p-2.5 rounded-xl border border-border/50 bg-card/60"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={photo.previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5 justify-center">
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => updateCaption(photo.id, e.target.value)}
                      placeholder="Add a caption (optional)"
                      disabled={isPending}
                      maxLength={140}
                      className="w-full text-sm rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50"
                    />
                    <span className="text-[11px] text-muted-foreground truncate">
                      {photo.file.name} · {formatBytes(photo.file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStaged(photo.id)}
                    disabled={isPending}
                    className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center hover:bg-muted transition-colors self-start disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={resetAndClose}
            disabled={isPending}
          >
            Close
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleUpload}
            disabled={
              isPending ||
              staged.length === 0 ||
              totalStagedBytes > MAX_TOTAL_SIZE_BYTES
            }
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" />
                Upload{staged.length > 0 ? ` (${staged.length})` : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
