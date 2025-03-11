import { useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { useDateTime } from "@/hooks/useDateTime";

export default function SimpleCompanySelect() {
  const { companies, selectedCompany, selectCompany, isLoading } = useCompany();
  const { date, time } = useDateTime();
  const [showTerminal, setShowTerminal] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const handleCompanySelect = (code: string) => {
    selectCompany(code);
    setSelectedCode(code);
    
    // Simulate terminal closing after selection
    setTimeout(() => {
      setShowTerminal(false);
    }, 1000);
  };

  if (!showTerminal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-void-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl border border-resistance-red p-6 bg-deep-space">
        <div className="border-b border-resistance-red pb-2 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stark-white">
            CONNECT_TO_NETWORK <span className="text-matrix-green terminal"></span>
          </h2>
          <div className="text-xs text-matrix-green font-mono">
            <span>{date}</span> | <span>{time}</span>
          </div>
        </div>

        <p className="text-stark-white mb-8">
          <span className="text-resistance-red">{'>'}</span> INITIALIZING SECURE CONNECTION_<br />
          <span className="text-resistance-red">{'>'}</span> SELECT TARGET CORPORATION:
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-void-black border border-resistance-red px-3 py-6 h-24 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {companies.map((company) => {              
              return (
                <button
                  key={company.code}
                  className={`company-btn bg-void-black border ${
                    selectedCode === company.code ? 'border-matrix-green' : 'border-resistance-red'
                  } px-3 py-6 text-center hover:bg-transparent transition relative overflow-hidden`}
                  onClick={() => handleCompanySelect(company.code)}
                >
                  <div className="absolute top-1 right-1 opacity-50">
                    <span className="text-xs text-matrix-green">[SECURE]</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-3xl mb-2 text-stark-white font-bold">
                      {company.code === "microsoft" ? "M+" : company.name.charAt(0)}
                    </div>
                    <div className="text-lg">{company.name}</div>
                    <div className="text-xs text-resistance-red mt-1">
                      {company.totalDepartures && company.totalDepartures.toLocaleString()} exits
                    </div>
                  </div>
                  
                  {selectedCode === company.code && (
                    <div className="mt-2 text-xs text-matrix-green animate-pulse">
                      CONNECTING...
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}