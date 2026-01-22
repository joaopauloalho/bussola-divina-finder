import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import DonationModal from "@/components/DonationModal";
import ParishHero from "@/components/parish/ParishHero";
import ParishTabs from "@/components/parish/ParishTabs";
import { useParish, useParishEvents, useParishPastorals, useParishImages } from "@/hooks/useParish";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const ParishProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const { data: parish, isLoading: isLoadingParish, error } = useParish(id);
  const { data: events, isLoading: isLoadingEvents } = useParishEvents(id);
  const { data: pastorals, isLoading: isLoadingPastorals } = useParishPastorals(id);
  const { data: images, isLoading: isLoadingImages } = useParishImages(id);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleDonateClick = () => {
    setIsDonationModalOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onLoginClick={handleLoginClick} />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-2">Paróquia não encontrada</h1>
            <p className="text-muted-foreground mb-4">A paróquia que você procura não existe ou foi removida.</p>
            <Link to="/">
              <Button>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar para o início
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isLoading = isLoadingParish || isLoadingEvents || isLoadingPastorals || isLoadingImages;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onLoginClick={handleLoginClick} />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para eventos
          </Link>
        </div>

        {isLoading ? (
          <div className="container py-8 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-12 w-full max-w-md" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        ) : parish ? (
          <>
            <ParishHero 
              parish={parish} 
              onDonateClick={handleDonateClick} 
            />
            <ParishTabs 
              parish={parish}
              events={events || []}
              pastorals={pastorals || []}
              images={images || []}
            />
          </>
        ) : null}
      </main>

      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        parishName={parish?.name || ""}
        pixKey={parish?.pix_key || ""}
      />
    </div>
  );
};

export default ParishProfile;
