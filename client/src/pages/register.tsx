import AuthScreen from "@/components/auth/AuthScreen";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Register() {
  const { isAuthenticated, isLoading } = useAuth();
  const [_, navigate] = useLocation();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return <AuthScreen isLogin={false} />;
}
