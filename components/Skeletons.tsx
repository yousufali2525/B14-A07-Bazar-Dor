export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-base-300 bg-base-100 p-4">
      <div className="flex items-center gap-3">
        <div className="skeleton h-14 w-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>
      </div>
      <div className="flex items-end justify-between border-t border-dashed border-base-300 pt-3">
        <div className="space-y-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-6 w-24" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
