import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = ({ className = "" }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const safeUsers = Array.isArray(users) ? users : [];
  const safeOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers : [];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? safeUsers.filter((user) => safeOnlineUsers.includes(user._id))
    : safeUsers;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full w-full md:w-16 lg:w-60 border-r border-base-300 flex flex-col transition-all duration-200 ${className}`}
      data-theme={theme}
    >
      <div className="border-b border-base-300 w-full flex-shrink-0 h-20 flex items-center">
        <div className="p-4 m-0 w-full flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <Users className="size-5" />
            <span className="font-semibold text-sm block md:hidden lg:block">Contacts</span>
          </div>
          {/* TODO: Online filter toggle */}
          <div className="mt-1 flex items-center gap-2 md:hidden lg:flex text-xs">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-xs"
              />
              <span className="text-xs">Online only</span>
            </label>
            <span className="text-xs text-base-content/60">({Math.max(safeOnlineUsers.length - 1, 0)})</span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2 sm:py-3 flex-1 flex flex-col">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full px-3 py-2.5 sm:px-2.5 sm:py-2 flex items-center gap-3 sm:gap-2.5
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative shrink-0 md:mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-10 sm:size-10 lg:size-11 object-cover rounded-full"
              />
              {safeOnlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-2.5 bg-green-500 
                  rounded-full ring-2 ring-base-100"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="block md:hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium text-sm truncate">{user.fullName}</div>
              <div className="text-xs text-base-content/60">
                {safeOnlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/60 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
