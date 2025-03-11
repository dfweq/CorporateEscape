import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Company } from "@shared/schema";

type CompanyContextType = {
  companies: Company[];
  selectedCompany: Company | null;
  selectCompany: (companyCode: string) => void;
  isLoading: boolean;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['/api/companies'],
    onSuccess: (data) => {
      // Default select the first company if none is selected
      if (!selectedCompany && data.length > 0) {
        setSelectedCompany(data[0]);
      }
    },
  });
  
  const selectCompany = (companyCode: string) => {
    const company = companies.find((c) => c.code === companyCode);
    if (company) {
      setSelectedCompany(company);
    }
  };
  
  return (
    <CompanyContext.Provider
      value={{
        companies,
        selectedCompany,
        selectCompany,
        isLoading,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
