import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { MessageSquare, Users, Zap, Globe, ArrowRight, Sparkles } from "lucide-react";
import { useEffect } from "react";

const HomePage = () => {
  const { selectedUser, users, getUsers, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const onlineUserCount = onlineUsers?.length || 0;
  const totalUsers = users?.length || 0;

  return (
    <div className="bg-base-100 pt-16">
      <div className="bg-base-100 w-full h-[calc(100dvh-4rem)] overflow-hidden box-border" data-theme={theme}>
          {selectedUser ? (
            // Chat view when user is selected
            <div className="flex h-full w-full items-stretch gap-0 min-h-0 min-w-0">
              <Sidebar className="hidden md:flex min-h-0 min-w-0" />
              <ChatContainer />
            </div>
          ) : (
            // Modern Home screen when no user is selected
            <div className="flex h-full">
              <Sidebar />
              
              <div className="hidden md:block flex-1 overflow-y-auto relative">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                
                <div className="relative z-10">
                  {/* Hero Section */}
                  <div className="px-8 md:px-12 pt-8 pb-12">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Welcome back</span>
                      </div>
                      
                      <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
                        GyānSetu
                      </h1>
                      
                      <p className="text-lg text-base-content/60 mb-2 font-medium">
                        Connect • Communicate • Create
                      </p>
                      <p className="text-base-content/50">
                        Experience seamless real-time messaging with a modern platform designed for meaningful connections
                      </p>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="px-8 md:px-12 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Online Users Card */}
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group-hover:bg-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-primary/20">
                              <Globe className="w-6 h-6 text-primary" />
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">LIVE</span>
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">{onlineUserCount}</div>
                          <p className="text-sm text-base-content/60">Online Users</p>
                        </div>
                      </div>

                      {/* Total Users Card */}
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group-hover:bg-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-blue-500/20">
                              <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">COMMUNITY</span>
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">{totalUsers}</div>
                          <p className="text-sm text-base-content/60">Total Users</p>
                        </div>
                      </div>

                      {/* Active Chats Card */}
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-secondary/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-secondary/50 transition-all duration-300 group-hover:bg-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-secondary/20">
                              <MessageSquare className="w-6 h-6 text-secondary" />
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/20 text-secondary">INSTANT</span>
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">∞</div>
                          <p className="text-sm text-base-content/60">Conversations</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="px-8 md:px-12 mb-12">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                      <span>Features</span>
                      <span className="text-base-content/30">✓</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Feature 1 */}
                      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-primary/50 hover:bg-white/10 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-primary/20 shrink-0">
                              <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg">Real-time Chat</h3>
                          </div>
                          <p className="text-sm text-base-content/60 leading-relaxed">
                            Send and receive messages instantly with ultra-low latency for seamless conversations
                          </p>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-blue-500/20 shrink-0">
                              <Globe className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-lg">Global Network</h3>
                          </div>
                          <p className="text-sm text-base-content/60 leading-relaxed">
                            Connect with people worldwide and build meaningful relationships across borders
                          </p>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-secondary/50 hover:bg-white/10 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-secondary/20 shrink-0">
                              <Users className="w-5 h-5 text-secondary" />
                            </div>
                            <h3 className="font-bold text-lg">Smart Profiles</h3>
                          </div>
                          <p className="text-sm text-base-content/60 leading-relaxed">
                            View comprehensive user profiles and see real-time online status at a glance
                          </p>
                        </div>
                      </div>

                      {/* Feature 4 */}
                      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-purple-500/20 shrink-0">
                              <MessageSquare className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="font-bold text-lg">Full History</h3>
                          </div>
                          <p className="text-sm text-base-content/60 leading-relaxed">
                            Access your complete message history and revisit meaningful conversations anytime
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="px-8 md:px-12 pb-12">
                    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 backdrop-blur-xl p-8 md:p-12">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
                      
                      <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to Connect?</h2>
                        <p className="text-base-content/70 mb-8 max-w-2xl">
                          Start meaningful conversations by selecting a user from the sidebar. Discover new people and expand your network today.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                          {totalUsers > 0 && (
                            <button 
                              onClick={() => users.length > 0 && setSelectedUser(users[0])}
                              className="group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
                            >
                              <MessageSquare className="w-5 h-5" />
                              Start Chatting
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                          <button 
                            onClick={() => {}}
                            className="inline-flex items-center gap-2 px-8 py-3 border border-primary/50 hover:border-primary hover:bg-primary/10 rounded-lg font-bold text-primary transition-all duration-300"
                          >
                            Explore Users
                            <Globe className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
export default HomePage;
