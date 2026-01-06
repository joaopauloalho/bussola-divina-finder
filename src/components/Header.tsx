import { Cross, Search, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border header-shadow">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Cross className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary hidden sm:inline">
            Bússola Católica
          </span>
          <span className="text-xl font-bold text-primary sm:hidden">
            Bússola
          </span>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar igreja, bairro ou padre..."
              className="w-full pl-10 bg-secondary border-0 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Login Paróquia</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Heart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Doar ao Projeto</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="container pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar igreja, bairro ou padre..."
            className="w-full pl-10 bg-secondary border-0"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
