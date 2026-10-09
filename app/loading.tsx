import { GridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12" aria-busy="true">
      <div className="skeleton h-8 w-56" />
      <GridSkeleton count={8} />
    </div>
  );
}
