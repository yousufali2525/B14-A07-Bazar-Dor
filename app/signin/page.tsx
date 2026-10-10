import { Suspense } from "react";
import SignInForm from "@/components/SignInForm";
export default function SignInPage() {
  return (
    <div className="flex justify-center px-4 py-12">
      <Suspense fallback={<div className="skeleton h-96 w-full max-w-md rounded-3xl" />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
