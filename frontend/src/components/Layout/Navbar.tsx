import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/roadmaps", label: "Roadmaps" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link
              to="/"
              className="flex items-center group active:opacity-70 transition-opacity"
            >
              <img
                src="../../../public/logo.png"
                alt="HobbyRoadmap"
                className="max-h-10"
              />
            </Link>

            {!isMobile && (
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex h-16 items-center text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {user ? (
                  <>
                    <Link
                      to="/saved"
                      className={`flex h-16 items-center text-sm font-medium transition-colors hover:text-primary ${
                        location.pathname === "/saved"
                          ? "text-primary"
                          : "text-gray-600"
                      }`}
                    >
                      Saved
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className={`flex h-16 items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                          location.pathname.startsWith("/admin")
                            ? "text-primary"
                            : "text-gray-600"
                        }`}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="flex h-16 items-center space-x-2 rounded-lg px-3 text-sm font-medium text-gray-700 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light/20">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span>{user.username}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex h-16 items-center text-sm font-medium text-gray-600 transition-colors hover:text-primary"
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-dark"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            )}

            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="touch-target p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-white shadow-xl"
            style={{ top: "56px" }}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex-1 py-6 divide-y divide-gray-100">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}

                {user ? (
                  <>
                    <Link
                      to="/saved"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      Saved Roadmaps
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          Admin Dashboard
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      Profile
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-6 py-4 text-base font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
                    >
                      Sign Out
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="p-6 space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-base font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-base font-medium rounded-lg bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
