// import CustomLoading from "@/components/CustomLoading";

import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = () => {
  // return <CustomLoading className="scale-105" text="Dashboard Loading..." />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-content-center items-center justify-center gap-6 scroll-auto p-5">
      {new Array(16).fill("").map((x: string, i: number) => (
        <div
          key={i}
          className="h-full flex-col flex justify-between rounded-lg p-3 bg-muted/50"
        >
          <Skeleton className="h-5 w-full rounded-lg" />

          <div className="w-11/12 my-4 space-y-3">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-10/12 rounded-lg" />
            <Skeleton className="h-4 w-9/12 rounded-lg" />
            <Skeleton className="h-4 w-11/12 rounded-lg" />
          </div>

          <div className="border-none! py-1 text-slate-600 flex flex-col items-start justify-center">
            <div className="flex gap-1 flex-wrap">
              {new Array(5).fill("").map((x: string, i: number) => (
                <Skeleton
                  key={i}
                  className="h-4.5 w-24 rounded-lg pb-1 pt-1.5 px-2"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardLoading;
