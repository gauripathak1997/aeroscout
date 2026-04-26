import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HowItWorks from "./pages/HowItWorks.tsx";
import DealSearch from "./pages/DealSearch.tsx";
import Lookup from "./pages/Lookup.tsx";
import GetCredits from "./pages/GetCredits.tsx";
import Results from "./pages/Results.tsx";
import AircraftDetail from "./pages/AircraftDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HowItWorks />} />
          <Route path="/deal-search" element={<DealSearch />} />
          <Route path="/lookup" element={<Lookup />} />
          <Route path="/get-credits" element={<GetCredits />} />
          <Route path="/results" element={<Results />} />
          <Route path="/aircraft/:id" element={<AircraftDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
