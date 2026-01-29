import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FiltersSidebar from "@/components/FiltersSidebar";
import EventsGrid from "@/components/EventsGrid";
import ParishMap from "@/components/ParishMap";
import ViewToggle, { ViewMode } from "@/components/ViewToggle";
import SubscriptionFooter from "@/components/SubscriptionFooter";
import Footer from "@/components/Footer";
import DonationModal from "@/components/DonationModal";
import LoginModal from "@/components/LoginModal";
import NewSuggestionModal from "@/components/NewSuggestionModal";
import MobileFilterSheet, { FilterState } from "@/components/MobileFilterSheet";

const Index = () => {
  // Modal states
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNewSuggestionModalOpen, setIsNewSuggestionModalOpen] = useState(false);
  const [selectedParish, setSelectedParish] = useState("");
  const [selectedPixKey, setSelectedPixKey] = useState("");

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Filter state - default to today
  const [filters, setFilters] = useState<FilterState>({
    eventTypes: ["missa", "confissao", "adoracao", "terco"],
    timeOfDay: [],
    neighborhood: "todos-os-bairros",
    officialOnly: false,
    dayOfWeek: new Date().getDay(), // Default to today
  });

  const handleDonateClick = (parishName: string, pixKey: string) => {
    setSelectedParish(parishName);
    setSelectedPixKey(pixKey);
    setIsDonationModalOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleSuggestClick = () => {
    setIsNewSuggestionModalOpen(true);
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
          
          {/* Events Content */}
          <div className="flex-1">
            {/* Header with toggle */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {viewMode === "list" ? "Próximos Eventos" : "Paróquias no Mapa"}
              </h2>
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
            
            {/* Content based on view mode */}
            {viewMode === "list" ? (
              <EventsGrid 
                filters={filters} 
                onDonateClick={handleDonateClick} 
                onSuggestClick={handleSuggestClick}
              />
            ) : (
              <ParishMap />
            )}
          </div>
        </div>
      </main>

      {/* Subscription Footer */}
      <SubscriptionFooter />

      <Footer onSuggestClick={handleSuggestClick} />

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
      <NewSuggestionModal
        isOpen={isNewSuggestionModalOpen}
        onClose={() => setIsNewSuggestionModalOpen(false)}
      />
    </div>
  );
};

export default Index;
