import React, { useState, useEffect, lazy, Suspense } from 'react';
import { CursorProvider } from './context/CursorContext';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { AuthProvider } from './context/AuthContext';
import { CustomCursor } from './components/ui/CustomCursor';
import { AnimatedBG } from './components/ui/AnimatedBG';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { FloatingNav } from './components/ui/FloatingNav';
import { FloatingContactButtons } from './components/ui/FloatingContactButtons';
import { HeroSection } from './components/sections/HeroSection';
import { EmergencyBanner } from './components/sections/EmergencyBanner';
import { StatsSection } from './components/sections/StatsSection';
import { ServicesGrid } from './components/sections/ServicesGrid';
import { TrustSection } from './components/sections/TrustSection';
import { ExpertsSection } from './components/sections/ExpertsSection';
import { Testimonials } from './components/sections/Testimonials';
import { RehabJourney } from './components/sections/RehabJourney';
import { FAQSection } from './components/sections/FAQSection';
import { ContactSection } from './components/sections/ContactSection';
import { FooterSection } from './components/sections/FooterSection';
import { OfferBanner } from './components/ui/OfferBanner';
import { FounderPage } from './components/sections/FounderPage';

// Lazy-loaded heavy elements & pages
const BodyNavigator = lazy(() => import('./components/sections/BodyNavigator').then(m => ({ default: m.BodyNavigator })));
const HomeGallery = lazy(() => import('./components/sections/HomeGallery').then(m => ({ default: m.HomeGallery })));
const EquipmentSection = lazy(() => import('./components/sections/EquipmentSection').then(m => ({ default: m.EquipmentSection })));
const ResourceBookshelf = lazy(() => import('./components/sections/ResourceBookshelf').then(m => ({ default: m.ResourceBookshelf })));
const BlogSection = lazy(() => import('./components/sections/BlogSection').then(m => ({ default: m.BlogSection })));
const GoogleMapSection = lazy(() => import('./components/sections/GoogleMapSection').then(m => ({ default: m.GoogleMapSection })));
const AIChatAssistant = lazy(() => import('./components/ui/AIChatAssistant').then(m => ({ default: m.AIChatAssistant })));
const BookingModal = lazy(() => import('./components/modals/BookingModal').then(m => ({ default: m.BookingModal })));
const SubmitReviewModal = lazy(() => import('./components/modals/SubmitReviewModal').then(m => ({ default: m.SubmitReviewModal })));
const BlogListPage = lazy(() => import('./components/blog/BlogListPage').then(m => ({ default: m.BlogListPage })));
const BlogDetailPage = lazy(() => import('./components/blog/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const ReviewsPage = lazy(() => import('./components/reviews/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));


export function MainContent() {
  const { offers } = useSiteData();
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitReviewOpen, setIsSubmitReviewOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string>('');
  const [bookingDoctor, setBookingDoctor] = useState<string>('');
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenBooking = (serviceOrDoctorOrArea?: string) => {
    if (serviceOrDoctorOrArea) {
      if (serviceOrDoctorOrArea.includes('Dr.') || serviceOrDoctorOrArea.includes('Sajid')) {
        setBookingDoctor(serviceOrDoctorOrArea);
        setBookingService('Home Visit Physiotherapy');
      } else {
        setBookingService(serviceOrDoctorOrArea);
      }
    }
    setIsBookingOpen(true);
  };

  const isBlogDetail = currentHash.startsWith('#blog/') && currentHash.length > 6;
  const isBlogList = currentHash === '#blog';
  const isReviewsPage = currentHash === '#reviews';
  const isAdminPage = currentHash === '#admin';
  const isFounderPage = currentHash === '#founder';
  const hasActiveOffer = offers && offers.some(o => o.isActive);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <SmoothScroll>
        <div className="relative min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
          <CustomCursor />
          <AnimatedBG />

          <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
            {isAdminPage ? (
              <AdminLayout />
            ) : (
              <>
                <OfferBanner />
                <FloatingNav onOpenBooking={() => handleOpenBooking()} />
                
                <main className={hasActiveOffer ? 'pt-8 sm:pt-10' : ''}>
                  {isBlogDetail ? (
                    <BlogDetailPage
                      slug={currentHash.replace('#blog/', '')}
                      onBack={() => {
                        window.location.hash = '#blog';
                      }}
                      onSelectBlog={(slug) => {
                        window.location.hash = `#blog/${slug}`;
                      }}
                    />
                  ) : isBlogList ? (
                    <BlogListPage
                      onSelectBlog={(slug) => {
                        window.location.hash = `#blog/${slug}`;
                      }}
                    />
                  ) : isReviewsPage ? (
                    <ReviewsPage
                      onOpenSubmitReview={() => setIsSubmitReviewOpen(true)}
                    />
                  ) : isFounderPage ? (
                    <FounderPage
                      onBack={() => { window.location.hash = ''; }}
                      onOpenBooking={() => handleOpenBooking()}
                    />
                  ) : (
                    <>
                      {/* 1. Hero Section */}
                      <HeroSection onOpenBooking={() => handleOpenBooking()} />
                      
                      {/* Emergency Banner */}
                      <EmergencyBanner />

                      {/* 2. Trust Numbers */}
                      <StatsSection />

                      {/* Services Section */}
                      <ServicesGrid onOpenBooking={(s) => handleOpenBooking(s)} />

                      {/* 3. Conditions (Body Navigator) */}
                      <Suspense fallback={<div className="py-12 text-center text-cyan-400">Loading Assessment Tool...</div>}>
                        <BodyNavigator onOpenBooking={(s) => handleOpenBooking(s)} />
                      </Suspense>

                      {/* 4. Why Choose ZK */}
                      <TrustSection />

                      {/* 5. Real Photos */}
                      <Suspense fallback={<div className="py-12 text-center text-cyan-400">Loading Gallery...</div>}>
                        <HomeGallery />
                      </Suspense>

                      {/* 6. Reviews */}
                      <Testimonials />

                      {/* 7. Doctors */}
                      <ExpertsSection onOpenBooking={(d) => handleOpenBooking(d)} />

                      {/* 8. Process (Rehab Journey) */}
                      <RehabJourney />

                      {/* 9. Equipment */}
                      <Suspense fallback={<div className="py-12 text-center text-cyan-400">Loading Equipment...</div>}>
                        <EquipmentSection />
                      </Suspense>

                      {/* Educational Books Section */}
                      <Suspense fallback={<div className="py-12 text-center text-cyan-400">Loading Library...</div>}>
                        <ResourceBookshelf />
                      </Suspense>

                      {/* Clinical Blog Articles Section */}
                      <Suspense fallback={<div className="py-12 text-center text-cyan-400">Loading Articles...</div>}>
                        <BlogSection />
                      </Suspense>

                      {/* 10. FAQ */}
                      <FAQSection />

                      {/* 11. Contact & Google Map */}
                      <Suspense fallback={<div className="py-12 text-center text-cyan-400">Loading Map...</div>}>
                        <GoogleMapSection />
                      </Suspense>
                      <ContactSection />
                    </>
                  )}
                </main>

                <FooterSection />
                
                {/* Floating WhatsApp and Call Action Buttons in Right-Bottom Corner */}
                <FloatingContactButtons onOpenBooking={() => handleOpenBooking()} />
                
                {/* AI Chat Assistant Widget */}
                <Suspense fallback={null}>
                  <AIChatAssistant />
                </Suspense>
              </>
            )}
          </Suspense>

          <Suspense fallback={null}>
            <BookingModal
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
              initialService={bookingService}
              initialDoctor={bookingDoctor}
            />
          </Suspense>

          <Suspense fallback={null}>
            <SubmitReviewModal
              isOpen={isSubmitReviewOpen}
              onClose={() => setIsSubmitReviewOpen(false)}
            />
          </Suspense>
        </div>
      </SmoothScroll>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteDataProvider>
        <CursorProvider>
          <MainContent />
        </CursorProvider>
      </SiteDataProvider>
    </AuthProvider>
  );
}
