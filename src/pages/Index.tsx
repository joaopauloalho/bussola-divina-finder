import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FiltersSidebar from "@/components/FiltersSidebar";
import EventsGrid from "@/components/EventsGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <HeroSection />
      
      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Hidden on mobile, show on large screens */}
          <div className="hidden lg:block">
            <FiltersSidebar />
          </div>
          
          {/* Events Grid */}
          <EventsGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
