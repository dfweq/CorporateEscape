import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

type LeaderboardUser = {
  id: number;
  username: string;
  displayName: string;
  burnoutScore: number;
  avatarInitials: string;
  company: string;
};

type BurnoutSymptoms = {
  mentalExhaustion: number;
  workCynicism: number;
  sundayAnxiety: number;
  productivity: number;
};

export default function BurnoutLeaderboard() {
  const { user } = useAuth();
  
  const { data: leaderboard = [], isLoading: isLeaderboardLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ['/api/burnout/leaderboard'],
  });
  
  const { data: symptoms, isLoading: isSymptomsLoading } = useQuery<BurnoutSymptoms>({
    queryKey: [`/api/burnout/symptoms/${user?.id}`],
    enabled: !!user,
  });
  
  const getSeverityLevel = (score: number) => {
    if (score >= 90) return "Extreme";
    if (score >= 75) return "Severe";
    if (score >= 60) return "High";
    if (score >= 40) return "Moderate";
    return "Low";
  };
  
  const getPosition = (userId: number) => {
    const index = leaderboard.findIndex(entry => entry.id === userId);
    return index !== -1 ? index + 1 : "N/A";
  };
  
  if (isLeaderboardLoading) {
    return (
      <section className="bg-deep-space border border-resistance-red p-4">
        <div className="border-b border-resistance-red pb-2 mb-4">
          <h2 className="text-lg font-bold">BURNOUT LEADERBOARD <span className="text-xs text-resistance-red">[LOADING]</span></h2>
        </div>
        <div className="space-y-3 mb-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-void-black border border-matrix-green p-3 h-16"></div>
          ))}
        </div>
        <div className="bg-void-black border border-resistance-red p-3 h-48 animate-pulse"></div>
      </section>
    );
  }
  
  return (
    <section className="bg-deep-space border border-resistance-red p-4">
      <div className="border-b border-resistance-red pb-2 mb-4">
        <h2 className="text-lg font-bold">BURNOUT LEADERBOARD <span className="text-xs text-resistance-red">[LIVE]</span></h2>
      </div>
      
      <div className="space-y-3 mb-6">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <div 
            key={entry.id} 
            className="bg-void-black border border-matrix-green p-3 flex items-center space-x-3 glitch-effect" 
            data-text=""
          >
            <div className="text-lg font-bold text-matrix-green">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="w-8 h-8 rounded-full bg-resistance-red flex items-center justify-center text-void-black font-bold">
              {entry.avatarInitials}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">#{entry.username}</span>
                <span className="text-sm text-resistance-red">{entry.burnoutScore}<span className="text-xs">/100</span></span>
              </div>
              <div className="w-full bg-deep-space h-1 mt-1">
                <div className="bg-resistance-red h-full" style={{ width: `${entry.burnoutScore}%` }}></div>
              </div>
            </div>
          </div>
        ))}
        
        {user && (
          <div 
            className="bg-void-black border border-matrix-green p-3 flex items-center space-x-3 glitch-effect" 
            data-text=""
          >
            <div className="text-lg font-bold text-data-yellow">
              {String(getPosition(user.id)).padStart(2, '0')}
            </div>
            <div className="w-8 h-8 rounded-full bg-resistance-red flex items-center justify-center text-void-black font-bold">
              {user.avatarInitials}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">#{user.username}</span>
                <span className="text-sm text-data-yellow">{user.burnoutScore}<span className="text-xs">/100</span></span>
              </div>
              <div className="w-full bg-deep-space h-1 mt-1">
                <div className="bg-data-yellow h-full" style={{ width: `${user.burnoutScore}%` }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {user && symptoms && !isSymptomsLoading && (
        <div className="bg-void-black border border-resistance-red p-3">
          <h3 className="text-xs text-resistance-red mb-3">BURNOUT SYMPTOMS</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs">
                <span>Mental Exhaustion</span>
                <span className="text-matrix-green">{getSeverityLevel(symptoms.mentalExhaustion)}</span>
              </div>
              <div className="w-full bg-deep-space h-1 mt-1">
                <div className="bg-matrix-green h-full" style={{ width: `${symptoms.mentalExhaustion}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs">
                <span>Work Cynicism</span>
                <span className="text-matrix-green">{getSeverityLevel(symptoms.workCynicism)}</span>
              </div>
              <div className="w-full bg-deep-space h-1 mt-1">
                <div className="bg-matrix-green h-full" style={{ width: `${symptoms.workCynicism}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs">
                <span>Sunday Anxiety</span>
                <span className="text-matrix-green">{getSeverityLevel(symptoms.sundayAnxiety)}</span>
              </div>
              <div className="w-full bg-deep-space h-1 mt-1">
                <div className="bg-matrix-green h-full" style={{ width: `${symptoms.sundayAnxiety}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs">
                <span>Productivity</span>
                <span className="text-resistance-red">{getSeverityLevel(symptoms.productivity)}</span>
              </div>
              <div className="w-full bg-deep-space h-1 mt-1">
                <div className="bg-resistance-red h-full" style={{ width: `${symptoms.productivity}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
