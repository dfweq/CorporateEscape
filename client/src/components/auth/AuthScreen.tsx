import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AuthScreenProps {
  isLogin?: boolean;
}

export default function AuthScreen({ isLogin = true }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("meta");
  
  const { login, register, isLoading } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      // Error is handled in AuthContext
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !username || !displayName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Generate avatar initials from display name
    const names = displayName.split(" ");
    const initials = names.length > 1 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
    
    try {
      await register({
        email,
        password,
        username,
        displayName,
        company,
        avatarInitials: initials,
      });
      navigate("/");
    } catch (error) {
      // Error is handled in AuthContext
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="bg-void-black border-2 border-resistance-red p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 
            className="text-4xl font-space font-bold text-resistance-red glitch-effect" 
            data-text="ExitNode"
          >
            <span className="text-matrix-green">&lt;</span>
            ExitNode
            <span className="text-matrix-green">&gt;</span>
          </h1>
          <p className="text-sm mt-2 opacity-70">the anti-corporate tech collective</p>
        </div>
        
        <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <>
              <div>
                <Label className="block text-xs mb-1 text-matrix-green">USERNAME</Label>
                <Input 
                  type="text" 
                  placeholder="unique_handle" 
                  className="w-full bg-terminal-gray border border-resistance-red px-3 py-2 font-mono focus:outline-none focus:border-matrix-green" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-xs mb-1 text-matrix-green">DISPLAY_NAME</Label>
                <Input 
                  type="text" 
                  placeholder="Your Display Name" 
                  className="w-full bg-terminal-gray border border-resistance-red px-3 py-2 font-mono focus:outline-none focus:border-matrix-green" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-xs mb-1 text-matrix-green">CORP_AFFILIATION</Label>
                <select 
                  className="w-full bg-terminal-gray border border-resistance-red px-3 py-2 font-mono focus:outline-none focus:border-matrix-green"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option value="meta">META</option>
                  <option value="apple">APPLE</option>
                  <option value="amazon">AMAZON</option>
                  <option value="netflix">NETFLIX</option>
                  <option value="google">GOOGLE</option>
                  <option value="microsoft">MICROSOFT</option>
                </select>
              </div>
            </>
          )}
          
          <div>
            <Label className="block text-xs mb-1 text-matrix-green">CORP_EMAIL</Label>
            <Input 
              type="email" 
              placeholder="name@techgiant.com" 
              className="w-full bg-terminal-gray border border-resistance-red px-3 py-2 font-mono focus:outline-none focus:border-matrix-green" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-resistance-red mt-1">&gt; Verification required: Big Tech credentials only</p>
          </div>
          
          <div>
            <Label className="block text-xs mb-1 text-matrix-green">ACCESS_KEY</Label>
            <Input 
              type="password" 
              placeholder="**************" 
              className="w-full bg-terminal-gray border border-resistance-red px-3 py-2 font-mono focus:outline-none focus:border-matrix-green" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit"
            className="mt-4 w-full bg-void-black border-2 border-resistance-red text-stark-white py-2 font-bold hover:bg-resistance-red hover:text-void-black transition glitch-effect" 
            data-text={isLogin ? "AUTHENTICATE" : "INITIATE"} 
            disabled={isLoading}
          >
            {isLogin ? "AUTHENTICATE" : "INITIATE SEQUENCE"}
          </Button>
          
          <div className="text-xs text-center mt-4">
            <span className="text-matrix-green">$</span>
            {isLogin ? (
              <>
                {" New to the rebellion? "}
                <a href="/register" className="text-resistance-red underline">
                  Initiate sequence
                </a>
              </>
            ) : (
              <>
                {" Already a rebel? "}
                <a href="/login" className="text-resistance-red underline">
                  Login here
                </a>
              </>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
