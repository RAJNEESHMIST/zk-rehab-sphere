import React, { useState, useEffect } from 'react';
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
import { RehabJourney } from './components/sections/RehabJourney';
import { BodyNavigator } from './components/sections/BodyNavigator';
import { HomeGallery } from './components/sections/HomeGallery';
import { ExpertsSection } from './components/sections/ExpertsSection';
import { Testimonials } from './components/sections/Testimonials';
import { EquipmentSection } from './components/sections/EquipmentSection';
import { ResourceBookshelf } from './components/sections/ResourceBookshelf';
import { BlogSection } from './components/sections/BlogSection';
import { FAQSection } from './components/sections/FAQSection';
import { GoogleMapSection } from './components/sections/GoogleMapSection';
import { ContactSection } from './components/sections/ContactSection';
import { FooterSection } from './components/sections/FooterSection';
import { AIChatAssistant } from './components/ui/AIChatAssistant';
import { BookingModal } from './components/modals/BookingModal';
import { SubmitReviewModal } from './components/modals/SubmitReviewModal';
import { BlogListPage } from './components/blog/BlogListPage';
import { BlogDetailPage } from './components/blog/BlogDetailPage';
import { ReviewsPage } from './components/reviews/ReviewsPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { OfferBanner } from './components/ui/OfferBanner';

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
  const hasActiveOffer = offers && offers.some(o => o.isActive);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <SmoothScroll>
        <div className="relative min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
          <CustomCursor />
          <AnimatedBG />

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
                    <BodyNavigator onOpenBooking={(s) => handleOpenBooking(s)} />

                    {/* 4. Why Choose ZK */}
                    <TrustSection />

                    {/* 5. Real Photos */}
                    <HomeGallery />

                    {/* 6. Reviews */}
                    <Testimonials />

                    {/* 7. Doctors */}
                    <ExpertsSection onOpenBooking={(d) => handleOpenBooking(d)} />

                    {/* 8. Process (Rehab Journey) */}
                    <RehabJourney />

                    {/* 9. Equipment */}
                    <EquipmentSection />

                    {/* Educational Books Section */}
                    <ResourceBookshelf />

                    {/* Clinical Blog Articles Section */}
                    <BlogSection />

                    {/* 10. FAQ */}
                    <FAQSection />

                    {/* 11. Contact & Google Map */}
                    <GoogleMapSection />
                    <ContactSection />
                  </>
                )}
              </main>

              <FooterSection />
              
              {/* Floating WhatsApp and Call Action Buttons in Right-Bottom Corner */}
              <FloatingContactButtons onOpenBooking={() => handleOpenBooking()} />
              
              {/* AI Chat Assistant Widget */}
              <AIChatAssistant />
            </>
          )}

          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            initialService={bookingService}
            initialDoctor={bookingDoctor}
          />

          <SubmitReviewModal
            isOpen={isSubmitReviewOpen}
            onClose={() => setIsSubmitReviewOpen(false)}
          />
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
