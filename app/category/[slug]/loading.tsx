import { GridSkeleton } from "@/components/Skeletons";
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10" aria-busy="true">
      <div className="flex items-center gap-4">
        <div className="skeleton h-16 w-16 rounded-2xl" />
        <div className="space-y-2">
          <div className="skeleton h-8 w-40" />
          <div className="skeleton h-4 w-24" />
        </div>
      </div>
      <GridSkeleton count={8} />
    </div>
  );
}
