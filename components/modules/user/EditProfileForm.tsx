"use client";

import { updateMyProfile } from "@/services/user/user.service";
import { IUser } from "@/types/user.types";
import { Edit, Loader2, Plus, UploadCloud, X } from "lucide-react";
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
import Image from "next/image";

export function EditProfileForm({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateMyProfile, null);

  // Local state for array inputs (travel interests & visited countries)
  const [interests, setInterests] = useState<string[]>(
    user.travelInterest || [],
  );
  const [newInterest, setNewInterest] = useState("");

  const [countries, setCountries] = useState<string[]>(
    user.visitedCountries || [],
  );
  const [newCountry, setNewCountry] = useState("");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile updated successfully!");
      //setOpen(false);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  const handleAddInterest = () => {
    if (
      newInterest.trim() &&
      interests.length < 5 &&
      !interests.includes(newInterest.trim())
    ) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleAddCountry = () => {
    if (newCountry.trim() && !countries.includes(newCountry.trim())) {
      setCountries([...countries, newCountry.trim()]);
      setNewCountry("");
    }
  };

  const handleRemoveCountry = (country: string) => {
    setCountries(countries.filter((c) => c !== country));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and travel preferences.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-6 pt-4">
          {/* Hidden inputs to pass array data via FormData */}
          {interests.map((interest, idx) => (
            <input
              key={`interest-${idx}`}
              type="hidden"
              name="travelInterest[]"
              value={interest}
            />
          ))}
          {countries.map((country, idx) => (
            <input
              key={`country-${idx}`}
              type="hidden"
              name="visitedCountries[]"
              value={country}
            />
          ))}

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center justify-center gap-4 py-4 border-2 border-dashed rounded-xl border-border/60 bg-muted/20">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-sm bg-muted flex items-center justify-center">
              {previewImage || user.picture ? (
                <Image
                  src={previewImage || user.picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground/50">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-center">
              <Label
                htmlFor="picture-upload"
                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload New Photo
              </Label>
              <Input
                id="picture-upload"
                name="file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground mt-2">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={user.name} required />
              <InputFieldError field="name" state={state} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user.phone}
                placeholder="e.g. +8801XXXXXXXXX"
              />

              <InputFieldError field="phone" state={state} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              name="bio"
              defaultValue={user.bio}
              placeholder="Tell us about yourself..."
            />
            <InputFieldError field="bio" state={state} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentLocation">Current Location</Label>
            <Input
              id="currentLocation"
              name="currentLocation"
              defaultValue={user.currentLocation}
              placeholder="e.g. New York, USA"
            />
            <InputFieldError field="currentLocation" state={state} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Travel Interests */}
            <div className="space-y-3">
              <Label>Travel Interests (Max 5)</Label>
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="e.g. Hiking"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  disabled={interests.length >= 5}
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleAddInterest}
                  disabled={interests.length >= 5}
                  variant="secondary"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <InputFieldError field="travelInterest" state={state} />

              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-primary hover:text-primary/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Visited Countries */}
            <div className="space-y-3">
              <Label>Visited Countries</Label>
              <div className="flex gap-2">
                <Input
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="e.g. Japan"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCountry();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleAddCountry}
                  variant="secondary"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <InputFieldError field="visitedCountries" state={state} />

              <div className="flex flex-wrap gap-2 mt-2">
                {countries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    {country}
                    <button
                      type="button"
                      onClick={() => handleRemoveCountry(country)}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-8" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
