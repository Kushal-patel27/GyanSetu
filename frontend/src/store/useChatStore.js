import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../api/axios.js";
import { useAuthStore } from "./useAuthStore";

const normalizeArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  if (Array.isArray(payload?.messages)) return payload.messages;
  if (Array.isArray(payload?.data?.messages)) return payload.data.messages;
  return [];
};

const appendUniqueMessage = (messages, nextMessage) => {
  const safeMessages = Array.isArray(messages) ? messages : [];
  if (!nextMessage) return messages;

  const messageExists = safeMessages.some((message) => {
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

  if (messageExists) return safeMessages;
  return [...safeMessages, nextMessage];
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
      set({ users: normalizeArrayPayload(res.data) });
    } catch (error) {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearAuthState();
        toast.error("Session expired. Please log in again.");
        set({ users: [] });
        return;
      }
      toast.error(error?.response?.data?.message || "Failed to load users");
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: normalizeArrayPayload(res.data) });
    } catch (error) {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearAuthState();
        toast.error("Session expired. Please log in again.");
        set({ messages: [] });
        return;
      }
      toast.error(error?.response?.data?.message || "Failed to load messages");
      set({ messages: [] });
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
        messages: appendUniqueMessage(state.messages, res.data?.data || res.data),
      }));
    } catch (error) {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearAuthState();
        toast.error("Session expired. Please log in again.");
        return;
      }
      toast.error(error?.response?.data?.message || "Failed to send message");
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
        (newMessage?.senderId === selectedUser._id && newMessage?.receiverId === authUserId) ||
        (newMessage?.senderId === authUserId && newMessage?.receiverId === selectedUser._id);

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
