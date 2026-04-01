const Footer = () => {
  return (
    <footer className="border-t border-base-300 bg-base-100 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 sm:py-5 md:py-6">
        <div className="flex items-center justify-center">
          <p className="text-xs sm:text-sm text-center text-base-content/70">
            © {new Date().getFullYear()} GyãnSetu <span className="mx-2">•</span> Built by Kushal Patel and Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


