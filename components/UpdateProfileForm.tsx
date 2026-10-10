"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function UpdateProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {e.preventDefault();
  const value = name.trim();
    if (!value) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }
    setLoading(true);
    const { error } = await authClient.updateUser({ name: value });
    setLoading(false);
    if (error) {
      toast.error(error.message || "তথ্য আপডেট করা যায়নি");
      return;
    }
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  };
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-5 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
      <h1 className="text-center font-display text-3xl font-bold">তথ্য আপডেট করুন</h1>
      <label className="form-control">
        <span className="label-text mb-1 font-medium">নাম</span>
        <input
          value={name} onChange={(e) => setName(e.target.value)} type="text"  placeholder="আপনার নাম"  className="input input-bordered w-full" />
      </label>
      <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-full">
        {loading ? <span className="loading loading-spinner loading-sm" /> : "তথ্য আপডেট করুন"}
      </button>
    </form>
  );
}
