const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="relative overflow-hidden hidden lg:flex items-center justify-center bg-base-200 p-12">
      {/* Animated gradient blobs background */}
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-primary/15 blur-2xl animate-float-slow" />
      <div className="absolute -bottom-12 -right-8 w-56 h-56 rounded-full bg-secondary/15 blur-2xl animate-float-slow animation-delay-2000" />
      <div className="absolute top-1/3 -right-16 w-40 h-40 rounded-full bg-accent/15 blur-2xl animate-float-slow animation-delay-4000" />

      <div className="relative max-w-md text-center space-y-4">
        <img src="/logo.png" alt="GyãnSetu logo" className="w-20 h-20 mx-auto rounded-xl shadow animate-bounce" />

        <div className="grid grid-cols-3 gap-2">
          {[
            { t: "Fast", a: "" },
            { t: "Secure", a: "" },
            { t: "Realtime", a: "" },
            { t: "Chats", a: "" },
            { t: "Media", a: "" },
            { t: "Sync", a: "" },
            { t: "Themes", a: "" },
            { t: "Online", a: "" },
            { t: "Friends", a: "" },
          ].map((box, i) => (
            <div key={i} className={`aspect-square rounded-xl bg-primary/10 flex items-center justify-center transition-all hover:scale-[1.03] hover:bg-primary/15 ${box.a}`}>
              <span className="text-[10px] text-primary/80 font-medium select-none">{box.t}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
