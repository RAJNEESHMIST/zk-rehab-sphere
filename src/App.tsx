import React, { useState, useEffect } from 'react';
import { CursorProvider } from './context/CursorContext';
import { SiteDataProvider } from './context/SiteDataContext';
import { AuthProvider } from './context/AuthContext';
import { CustomCursor } from './components/ui/CustomCursor';
import { AnimatedBG } from './components/ui/AnimatedBG';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { FloatingNav } from './components/ui/FloatingNav';
import { FloatingContactButtons } from './components/ui/FloatingContactButtons';
import { HeroSection } from './components/sections/HeroSection';
import { TrustSection } from './components/sections/TrustSection';
import { AboutFounder } from './components/sections/AboutFounder';
import { RehabJourney } from './components/sections/RehabJourney';
import { ServicesGrid } from './components/sections/ServicesGrid';
import { BodyNavigator } from './components/sections/BodyNavigator';
import { HomeGallery } from './components/sections/HomeGallery';
import { AreaCoverageSection } from './components/sections/AreaCoverageSection';
import { ExpertsSection } from './components/sections/ExpertsSection';
import { Testimonials } from './components/sections/Testimonials';
import { ResourceBookshelf } from './components/sections/ResourceBookshelf';
import { BlogSection } from './components/sections/BlogSection';
import { ContactSection } from './components/sections/ContactSection';
import { FooterSection } from './components/sections/FooterSection';
import { BookingModal } from './components/modals/BookingModal';
import { SubmitReviewModal } from './components/modals/SubmitReviewModal';
import { BlogListPage } from './components/blog/BlogListPage';
import { BlogDetailPage } from './components/blog/BlogDetailPage';
import { ReviewsPage } from './components/reviews/ReviewsPage';
import { AdminLayout } from './components/admin/AdminLayout';

export function MainContent() {
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
              <FloatingNav onOpenBooking={() => handleOpenBooking()} />
              
              <main>
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
                    {/* Hero Section */}
                    <HeroSection onOpenBooking={() => handleOpenBooking()} />
                    
                    {/* Authentic Photo Trust Section */}
                    <TrustSection />

                    {/* About Sajid Khan Founder Section */}
                    <AboutFounder />

                    {/* 7-Step Home Visit Experience Storytelling */}
                    <RehabJourney />

                    {/* 10 Core Rehabilitation Services */}
                    <ServicesGrid onOpenBooking={(s) => handleOpenBooking(s)} />

                    {/* Interactive Body Explorer */}
                    <BodyNavigator onOpenBooking={(s) => handleOpenBooking(s)} />

                    {/* Home Visit Photo Archive Masonry Gallery */}
                    <HomeGallery />

                    {/* Tricity Area Coverage Pages (Chandigarh, Mohali, Kharar) */}
                    <AreaCoverageSection onOpenBooking={(a) => handleOpenBooking(a)} />

                    {/* Clinical Leadership & Doctors Team */}
                    <ExpertsSection onOpenBooking={(d) => handleOpenBooking(d)} />

                    {/* Real Patient Recoveries & Video Testimonials */}
                    <Testimonials />

                    {/* Educational Handbooks & Resources */}
                    <ResourceBookshelf />

                    {/* Clinical Rehabilitation Articles Preview */}
                    <BlogSection />

                    {/* Contact & Appointment Booking */}
                    <ContactSection />
                  </>
                )}
              </main>

              <FooterSection />
              
              {/* Floating WhatsApp and Call Action Buttons in Right-Bottom Corner */}
              <FloatingContactButtons />
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
