export default function RegistrationFormSkeleton() {
  return (
    <>
      <div className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex-1 w-full space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-[54px] w-full bg-gray-200 rounded   animate-pulse" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-[54px] w-full bg-gray-200 rounded   animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-[54px] w-full bg-gray-200 rounded   animate-pulse" />
        </div>

        <div className="w-full h-12 bg-gray-200 rounded animate-pulse" />

        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mx-auto" />
      </div>

      <div className="my-10 dividerWrapper flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200 animate-pulse" />
        <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-px flex-1 bg-gray-200 animate-pulse" />
      </div>

      <div className="w-full h-12 bg-gray-200 rounded animate-pulse" />
    </>
  );
}
