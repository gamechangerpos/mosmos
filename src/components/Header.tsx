import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isVisibleOverHero?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate
}) => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Virgin LE pattern: shrink at scrollY > 80px
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigate
  const handleNav = useCallback((path: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  }, [onNavigate]);

  const isHomePage = currentPath === '/' || currentPath === '';
  const showTransparent = isHomePage && !isScrolled;

  const navLinks = [
    { label: 'Destinations', path: '/destinations' },
    { label: 'Safari Tours', path: '/safari-tours' },
    { label: 'Stays', path: '/stays' },
    { label: 'Packages', path: '/travel-packages' },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 header-glass transition-all duration-500 ${
          showTransparent
            ? 'py-5 sm:py-6'
            : 'py-2.5 sm:py-3 header-glass--scrolled'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Brand Wordmark — scales down on scroll (Virgin LE pattern) */}
          <button
            onClick={() => handleNav('/')}
            className="group text-left flex flex-col focus-visible:outline-2 focus-visible:outline-[#B69A68] transition-all duration-500 cursor-pointer"
          >
            <span
              className={`font-serif font-light tracking-[0.22em] uppercase transition-all duration-500 ${
                showTransparent
                  ? 'text-2xl sm:text-3xl text-white drop-shadow-md group-hover:text-[#B69A68]'
                  : 'text-xl sm:text-2xl text-[#20221F] group-hover:text-[#B69A68]'
              }`}
            >
              MOS MOS
            </span>
            <span
              className={`font-sans font-bold uppercase -mt-0.5 transition-all duration-500 ${
                showTransparent
                  ? 'text-[10px] sm:text-[11px] tracking-[0.4em] text-[#B69A68] drop-shadow-sm'
                  : 'text-[9px] sm:text-[10px] tracking-[0.4em] text-[#78634B]'
              }`}
            >
              Safaris
            </span>
          </button>

          {/* Desktop Navigation — Virgin LE minimal inline style */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));

              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3.5 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 cursor-pointer relative ${
                    isActive
                      ? showTransparent
                        ? 'text-[#B69A68] font-bold'
                        : 'text-[#B69A68] font-bold'
                      : showTransparent
                      ? 'text-white/90 hover:text-[#B69A68]'
                      : 'text-[#20221F]/70 hover:text-[#20221F]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-[#B69A68]" />
                  )}
                </button>
              );
            })}

            {/* Auth Link: Account or Sign In */}
            <button
              onClick={() => handleNav(user ? '/account' : '/login')}
              className={`px-3.5 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                currentPath === '/account' || currentPath === '/login'
                  ? 'text-[#B69A68] font-bold'
                  : showTransparent
                  ? 'text-white/90 hover:text-[#B69A68]'
                  : 'text-[#20221F]/70 hover:text-[#20221F]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#B69A68]" />
              <span>{user ? (user.displayName ? user.displayName.split(' ')[0] : 'Account') : 'Sign In'}</span>
            </button>

            {/* CTA Button — Virgin LE "Enquire" style */}
            <button
              onClick={() => handleNav('/plan-trip')}
              className={`ml-2 px-5 py-2 text-[11px] uppercase tracking-[0.15em] font-semibold transition-all duration-300 cursor-pointer border ${
                showTransparent
                  ? 'border-white/40 text-white hover:bg-white hover:text-[#20221F]'
                  : 'border-[#20221F] text-[#20221F] hover:bg-[#20221F] hover:text-[#F7F4ED]'
              }`}
            >
              Enquire
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors cursor-pointer ${
              showTransparent ? 'text-white' : 'text-[#20221F]'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F7F4ED] pt-24 px-6 md:hidden animate-fade-in overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left py-3 border-b border-[#D9D0C2]/50 font-serif text-2xl font-light transition-colors ${
                    isActive ? 'text-[#B69A68]' : 'text-[#20221F] hover:text-[#78634B]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <button
              onClick={() => handleNav(user ? '/account' : '/login')}
              className="text-left py-3 border-b border-[#D9D0C2]/50 font-serif text-2xl font-light text-[#78634B] flex items-center justify-between"
            >
              <span>{user ? 'My Guest Account' : 'Sign In / Register'}</span>
              <User className="w-5 h-5 text-[#B69A68]" />
            </button>

            <button
              onClick={() => handleNav('/plan-trip')}
              className="mt-6 w-full py-4 bg-[#20221F] text-[#F7F4ED] font-sans text-xs uppercase tracking-[0.2em] font-semibold"
            >
              Plan Your Safari
            </button>
          </nav>
        </div>
      )}
    </>
  );
};
