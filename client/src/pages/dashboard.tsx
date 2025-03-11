import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompanySelection from "@/components/dashboard/CompanySelection";
import SimpleCompanySelect from "@/components/dashboard/SimpleCompanySelect";
import DepartureStats from "@/components/dashboard/DepartureStats";
import BurnoutLeaderboard from "@/components/dashboard/BurnoutLeaderboard";
import NetworkActivity from "@/components/dashboard/NetworkActivity";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import { useCompany } from "@/context/CompanyContext";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { selectedCompany } = useCompany();
  const [initialSelectionMade, setInitialSelectionMade] = useState(false);
  
  // Track if user has selected a company
  useEffect(() => {
    if (selectedCompany && !initialSelectionMade) {
      setInitialSelectionMade(true);
    }
  }, [selectedCompany, initialSelectionMade]);
  
  return (
    <div id="main-dashboard">
      <Header />
      
      {/* Show company selection overlay if no selection has been made */}
      {!initialSelectionMade && <SimpleCompanySelect />}
      
      <main className="container mx-auto px-4 py-6">
        <CompanySelection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DepartureStats />
          <BurnoutLeaderboard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6" id="network">
          <NetworkActivity />
          <NotificationPanel />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
