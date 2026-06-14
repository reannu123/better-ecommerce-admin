const Loading = () => {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6" aria-label="Loading page">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-px w-full bg-border" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-lg border bg-muted/50"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-lg border bg-muted/50" />
    </div>
  );
};

export default Loading;
