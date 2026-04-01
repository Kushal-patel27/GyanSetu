import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-full md:w-16 lg:w-60 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full flex-shrink-0 h-20 flex items-center">
        <div className="p-4 m-0 w-full">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold text-sm block md:hidden lg:block">Contacts</span>
          </div>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-2">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full px-2.5 py-2 flex items-center gap-2.5">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-10 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="block md:hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-3.5 w-28 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
