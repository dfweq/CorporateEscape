import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompanySelection from "@/components/dashboard/CompanySelection";
import DepartureStats from "@/components/dashboard/DepartureStats";
import BurnoutLeaderboard from "@/components/dashboard/BurnoutLeaderboard";
import NetworkActivity from "@/components/dashboard/NetworkActivity";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [_, navigate] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-resistance-red text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div id="main-dashboard">
      <Header />
      
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
