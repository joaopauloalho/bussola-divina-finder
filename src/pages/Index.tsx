import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FiltersSidebar from "@/components/FiltersSidebar";
import EventsGrid from "@/components/EventsGrid";
import SubscriptionFooter from "@/components/SubscriptionFooter";
import Footer from "@/components/Footer";
import DonationModal from "@/components/DonationModal";
import LoginModal from "@/components/LoginModal";
import MobileFilterSheet, { FilterState } from "@/components/MobileFilterSheet";

const Index = () => {
  // Modal states
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedParish, setSelectedParish] = useState("");
  const [selectedPixKey, setSelectedPixKey] = useState("");

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    eventTypes: ["missa", "confissao", "adoracao", "terco"],
    timeOfDay: [],
    neighborhood: "todos-os-bairros",
    officialOnly: false,
  });

  const handleDonateClick = (parishName: string, pixKey: string) => {
    setSelectedParish(parishName);
    setSelectedPixKey(pixKey);
    setIsDonationModalOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onLoginClick={handleLoginClick} />
      <HeroSection />
      
      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Hidden on mobile, show on large screens */}
          <div className="hidden lg:block">
            <FiltersSidebar filters={filters} onFilterChange={setFilters} />
          </div>
          
          {/* Events Grid */}
          <EventsGrid filters={filters} onDonateClick={handleDonateClick} />
        </div>
      </main>

      {/* Subscription Footer */}
      <SubscriptionFooter />

      <Footer />

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet filters={filters} onFilterChange={setFilters} />

      {/* Modals */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        parishName={selectedParish}
        pixKey={selectedPixKey}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Index;
