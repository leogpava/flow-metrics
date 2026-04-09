interface LoadingSkeletonProps {
  mode?: 'page' | 'shell';
}

export function LoadingSkeleton({ mode = 'page' }: LoadingSkeletonProps) {
  if (mode === 'shell') {
    return (
      <div className="min-h-screen bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-16 rounded-3xl bg-white" />
          <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
            <div className="h-[720px] rounded-3xl bg-white" />
            <div className="space-y-6">
              <div className="h-28 rounded-3xl bg-white" />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="h-40 rounded-3xl bg-white" />
                <div className="h-40 rounded-3xl bg-white" />
                <div className="h-40 rounded-3xl bg-white" />
                <div className="h-40 rounded-3xl bg-white" />
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="h-80 rounded-3xl bg-white" />
                <div className="h-80 rounded-3xl bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-6">
      <div className="h-24 rounded-3xl bg-white" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-36 rounded-3xl bg-white" />
        <div className="h-36 rounded-3xl bg-white" />
        <div className="h-36 rounded-3xl bg-white" />
        <div className="h-36 rounded-3xl bg-white" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-80 rounded-3xl bg-white" />
        <div className="h-80 rounded-3xl bg-white" />
      </div>
    </div>
  );
}
