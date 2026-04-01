import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const appendUniqueMessage = (messages, nextMessage) => {
  if (!nextMessage) return messages;

  const messageExists = messages.some((message) => {
    if (nextMessage._id && message._id === nextMessage._id) return true;
    if (
      nextMessage.clientMessageId &&
      message.clientMessageId &&
      message.clientMessageId === nextMessage.clientMessageId
    ) {
      return true;
    }
    return false;
  });

  if (messageExists) return messages;
  return [...messages, nextMessage];
};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  messageListener: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, isSendingMessage } = get();
    if (!selectedUser || isSendingMessage) return;

    const clientMessageId =
      messageData.clientMessageId ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        ...messageData,
        clientMessageId,
      });
      set((state) => ({
        messages: appendUniqueMessage(state.messages, res.data),
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, messageListener } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const authUserId = useAuthStore.getState().authUser?._id;
    if (!socket || !authUserId) return;

    if (messageListener) {
      socket.off("newMessage", messageListener);
    }

    const listener = (newMessage) => {
      const isMessageForCurrentConversation =
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUserId) ||
        (newMessage.senderId === authUserId && newMessage.receiverId === selectedUser._id);

      if (!isMessageForCurrentConversation) return;

      set((state) => ({
        messages: appendUniqueMessage(state.messages, newMessage),
      }));
    };

    socket.on("newMessage", listener);
    set({ messageListener: listener });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { messageListener } = get();
    if (socket && messageListener) {
      socket.off("newMessage", messageListener);
    }
    set({ messageListener: null });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
