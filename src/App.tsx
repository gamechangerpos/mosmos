import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { ToursPage } from './pages/ToursPage';
import { TourDetailPage } from './pages/TourDetailPage';
import { StaysPage } from './pages/StaysPage';
import { StayDetailPage } from './pages/StayDetailPage';
import { FlightsPage } from './pages/FlightsPage';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { TravelGuidesPage } from './pages/TravelGuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { BookingStatusPage } from './pages/BookingStatusPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPage } from './pages/LegalPage';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { AnalyticsService } from './services/analyticsService';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isHeaderVisibleOverHero, setIsHeaderVisibleOverHero] = useState<boolean>(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track page view analytics on every route change
  useEffect(() => {
    AnalyticsService.trackPageView(currentPath);
  }, [currentPath]);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matcher
  const renderCurrentRoute = () => {
    const path = currentPath;

    // Homepage
    if (path === '/' || path === '') {
      return (
        <HomePage
          onNavigate={navigate}
          onHeaderVisibleChange={setIsHeaderVisibleOverHero}
        />
      );
    }

    // Customer Authentication & Account Portal
    if (path === '/login') {
      return <AuthPage onNavigate={navigate} initialMode="login" />;
    }
    if (path === '/register') {
      return <AuthPage onNavigate={navigate} initialMode="register" />;
    }
    if (path === '/account') {
      return <AccountPage onNavigate={navigate} />;
    }

    // Destinations
    if (path === '/destinations') {
      return <DestinationsPage onNavigate={navigate} />;
    }
    if (path.startsWith('/destinations/')) {
      const slug = path.replace('/destinations/', '');
      return <DestinationDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Safari Tours
    if (path === '/safari-tours') {
      return <ToursPage onNavigate={navigate} />;
    }
    if (path.startsWith('/safari-tours/')) {
      const slug = path.replace('/safari-tours/', '');
      return <TourDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Accommodations / Stays
    if (path === '/stays') {
      return <StaysPage onNavigate={navigate} />;
    }
    if (path.startsWith('/stays/')) {
      const slug = path.replace('/stays/', '');
      return <StayDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Flights
    if (path === '/flights') {
      return <FlightsPage onNavigate={navigate} />;
    }

    // Travel Packages
    if (path === '/travel-packages') {
      return <PackagesPage onNavigate={navigate} />;
    }
    if (path.startsWith('/travel-packages/')) {
      const slug = path.replace('/travel-packages/', '');
      return <PackageDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Plan Trip
    if (path.startsWith('/plan-trip')) {
      const searchParams = new URLSearchParams(window.location.search);
      const destParam = searchParams.get('destination') || undefined;
      return <PlanTripPage onNavigate={navigate} initialDestination={destParam} />;
    }

    // About, Contact, FAQ
    if (path === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (path === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (path === '/faq') {
      return <FAQPage onNavigate={navigate} />;
    }

    // Travel Guides
    if (path === '/travel-guides') {
      return <TravelGuidesPage onNavigate={navigate} />;
    }
    if (path.startsWith('/travel-guides/')) {
      const slug = path.replace('/travel-guides/', '');
      return <GuideDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Booking Status / Tracker
    if (path.startsWith('/booking/')) {
      const ref = path.replace('/booking/', '');
      return <BookingStatusPage initialReference={ref} onNavigate={navigate} />;
    }
    if (path === '/booking') {
      return <BookingStatusPage onNavigate={navigate} />;
    }

    // Admin Dashboard
    if (path === '/admin') {
      return <AdminPage onNavigate={navigate} />;
    }

    // Legal routes
    if (path === '/privacy-policy') {
      return <LegalPage initialTab="privacy" onNavigate={navigate} />;
    }
    if (path === '/terms') {
      return <LegalPage initialTab="terms" onNavigate={navigate} />;
    }
    if (path === '/cancellation-policy') {
      return <LegalPage initialTab="cancellation" onNavigate={navigate} />;
    }

    // 404 Fallback
    return (
      <div className="pt-36 pb-24 text-center px-4 bg-[#F7F4ED] min-h-[60vh] flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-widest text-[#78634B] font-semibold mb-2">
          Route Not Found
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#20221F] mb-4">
          This Savanna Trail Does Not Exist
        </h1>
        <p className="text-sm text-[#20221F]/70 max-w-md mx-auto mb-8 font-light">
          The requested page could not be located. Explore our destinations or return to the cinematic homepage.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#20221F] hover:bg-[#343C32] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Return to Safari Entrance
        </button>
      </div>
    );
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4ED] text-[#20221F]">
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          isVisibleOverHero={isHeaderVisibleOverHero}
        />
        <main className="flex-1">
          {renderCurrentRoute()}
        </main>
        <Footer onNavigate={navigate} />
      </div>
    </AuthProvider>
  );
}
