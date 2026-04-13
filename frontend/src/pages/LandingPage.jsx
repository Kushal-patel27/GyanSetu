import { Link } from "react-router-dom";
import { MessageSquare, Zap, Globe, Users, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200" data-theme="cmyk">
      {/* Navigation */}
      <nav className="border-b border-base-300/30 backdrop-blur-lg bg-base-100/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <img
              src="/logo.png"
              alt="GyaanSetu logo"
              className="size-9 object-contain"
            />
            <h1 className="text-lg font-bold">GyānSetu</h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">The Modern Chat Platform</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent leading-tight">
            Connect. Communicate. Create.
          </h1>

          <p className="text-xl text-base-content/60 mb-8 leading-relaxed max-w-2xl mx-auto">
            Experience seamless real-time messaging with GyānSetu. Connect with people worldwide, build meaningful relationships, and join a thriving global community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 group"
            >
              Start Chatting for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-primary/50 hover:border-primary hover:bg-primary/10 rounded-lg font-bold text-primary transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5" />
              Already have an account?
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-12 max-w-2xl mx-auto mb-20">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10k+</div>
              <div className="text-sm text-base-content/60">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">1M+</div>
              <div className="text-sm text-base-content/60">Messages Daily</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">150+</div>
              <div className="text-sm text-base-content/60">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/5 backdrop-blur-xl border-t border-b border-white/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Why Choose GyānSetu?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
                  <p className="text-base-content/60">
                    Real-time messaging with ultra-low latency for instant connections
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Global Community</h3>
                  <p className="text-base-content/60">
                    Connect with people from over 150 countries around the world
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-secondary/20">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Rich Profiles</h3>
                  <p className="text-base-content/60">
                    View detailed user profiles and see online status in real-time
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Full Message History</h3>
                  <p className="text-base-content/60">
                    Access and search your complete conversation history anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">What You Get</h2>

          <div className="space-y-4 mb-16">
            {[
              "Instant messaging with real-time notifications",
              "Secure and private conversations",
              "Beautiful, intuitive user interface",
              "Works on all devices and browsers",
              "No ads, clean experience",
              "Free to use forever"
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-lg font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/20 via-blue-500/10 to-secondary/20 border-t border-primary/30 backdrop-blur-xl py-20 pb-40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Thousands of Users Today
            </h2>
            <p className="text-lg text-base-content/70 mb-8">
              Start connecting with people worldwide. It takes less than a minute to sign up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 group"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-primary/50 hover:border-primary hover:bg-primary/10 rounded-lg font-bold text-primary transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
