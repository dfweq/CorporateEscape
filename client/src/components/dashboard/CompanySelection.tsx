import { useCompany } from "@/context/CompanyContext";
import { useDateTime } from "@/hooks/useDateTime";

export default function CompanySelection() {
  const { companies, selectedCompany, selectCompany, isLoading } = useCompany();
  const { date, time } = useDateTime();

  const handleCompanySelect = (code: string) => {
    selectCompany(code);
  };

  return (
    <section className="mb-8">
      <div className="border-b border-resistance-red pb-2 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-stark-white">
          CORP_INTEL <span className="text-matrix-green terminal"></span>
        </h2>
        <div className="text-xs text-matrix-green font-mono">
          <span id="current-date">{date}</span> |{" "}
          <span id="current-time">{time}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-void-black border border-resistance-red px-3 py-2 h-20 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {companies.map((company) => (
            <button
              key={company.code}
              className={`company-btn bg-void-black border border-resistance-red px-3 py-2 text-center hover:bg-transparent transition ${
                selectedCompany?.code === company.code ? "active" : ""
              }`}
              data-company={company.code}
              onClick={() => handleCompanySelect(company.code)}
            >
              <div className="text-3xl mb-1">{company.code === "microsoft" ? "M+" : company.name.charAt(0)}</div>
              <div className="text-xs">{company.name}</div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
