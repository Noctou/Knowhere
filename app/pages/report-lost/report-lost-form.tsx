"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { campusLocations, itemCategories } from "@/app/lib/form-options";
import { addStoredItem } from "@/app/lib/item-storage";

type ReportLostFormProps = {
  role: "student" | "faculty" | "admin";
  userName?: string;
};

export default function ReportLostForm({ role, userName }: ReportLostFormProps) {
  const router = useRouter();
  const query = `role=${role}${userName ? `&user=${encodeURIComponent(userName)}` : ""}`;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isContactPrivate, setIsContactPrivate] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const uploadTimerRef = useRef<number | null>(null);

  function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    if (uploadTimerRef.current) {
      window.clearInterval(uploadTimerRef.current);
    }

    const file = event.target.files?.[0];

    if (!file) {
      setUploadProgress(0);
      setIsUploading(false);
      setImageUrl("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result || ""));
    reader.readAsDataURL(file);

    setUploadProgress(0);
    setIsUploading(true);

    uploadTimerRef.current = window.setInterval(() => {
      setUploadProgress((currentProgress) => {
        const nextProgress = Math.min(currentProgress + 20, 100);

        if (nextProgress === 100 && uploadTimerRef.current) {
          window.clearInterval(uploadTimerRef.current);
          uploadTimerRef.current = null;
          setIsUploading(false);
        }

        return nextProgress;
      });
    }, 220);
  }

  function submitItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const dateTime = String(form.get("dateTime") || "");

    addStoredItem({
      id: Date.now(),
      title: String(form.get("title") || "Untitled item"),
      category: String(form.get("category") || "Uncategorized"),
      location: String(form.get("location") || "Unknown location"),
      date: dateTime ? dateTime.replace("T", " ") : new Date().toISOString().slice(0, 10),
      status: "Lost",
      postedBy: role === "admin" ? "Manager" : userName || "Student",
      description: String(form.get("description") || "No description provided."),
      contactEmail: String(form.get("contactEmail") || ""),
      isContactPrivate,
      imageUrl,
    });

    setShowSuccess(true);
    window.setTimeout(() => {
      router.push(`/pages/search-browse?${query}`);
    }, 900);
  }

  return (
    <form
      onSubmit={submitItem}
      className="mx-auto max-w-2xl space-y-5 rounded-lg bg-white p-6 shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Item name
        </label>
        <input
          name="title"
          required
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          placeholder="Example: Blue Hydro Flask"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
            defaultValue=""
          >
            <option value="" disabled>
              Select category
            </option>
            {itemCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last seen location
          </label>
          <select
            name="location"
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
            defaultValue=""
          >
            <option value="" disabled>
              Select campus location
            </option>
            {campusLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Photo
        </label>
        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={uploadPhoto}
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-green-700 focus:border-gray-900"
        />
        {uploadProgress > 0 ? (
          <div className="mt-3" aria-live="polite">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{isUploading ? "Uploading photo" : "Photo uploaded"}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-green-600 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Selected lost item"
            className="mt-3 h-40 w-full rounded-md bg-gray-100 object-contain"
          />
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date and time lost
        </label>
        <input
          name="dateTime"
          type="datetime-local"
          required
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          placeholder="Add color, marks, labels, or other identifying details."
        />
      </div>
      <div className="rounded-md border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700">
          Contact email
        </label>
        <input
          name="contactEmail"
          type="email"
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          placeholder="name@example.com"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm text-gray-700">
            {isContactPrivate
              ? "Your email is hidden"
              : "Your email is public"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isContactPrivate}
            onClick={() => setIsContactPrivate((current) => !current)}
            className={`relative h-7 w-12 rounded-full transition ${
              isContactPrivate ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                isContactPrivate ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>
      <button
        disabled={isUploading || isSubmitting}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isSubmitting ? "Posting..." : "Post lost item"}
      </button>
      {showSuccess ? (
        <div
          role="status"
          className="fixed bottom-6 right-6 rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          Success. Lost item report submitted.
        </div>
      ) : null}
    </form>
  );
}
