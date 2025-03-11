import { useCompany } from "@/context/CompanyContext";

export default function DepartureStats() {
  const { selectedCompany, isLoading } = useCompany();

  if (isLoading) {
    return (
      <section className="lg:col-span-2 bg-deep-space border border-resistance-red p-4">
        <div className="border-b border-resistance-red pb-2 mb-4">
          <h2 className="text-lg font-bold">LOADING STATS...</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-void-black border border-matrix-green p-3 h-24"></div>
            <div className="bg-void-black border border-matrix-green p-3 h-24"></div>
          </div>
          <div className="bg-void-black border border-resistance-red p-3 mb-4 h-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-void-black border border-matrix-green p-3 h-40"></div>
            <div className="bg-void-black border border-resistance-red p-3 h-40"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!selectedCompany) {
    return (
      <section className="lg:col-span-2 bg-deep-space border border-resistance-red p-4">
        <div className="border-b border-resistance-red pb-2 mb-4">
          <h2 className="text-lg font-bold">NO COMPANY SELECTED</h2>
        </div>
        <p className="text-matrix-green">Select a company to view departure statistics.</p>
      </section>
    );
  }

  // Helper to convert to years with one decimal point
  const monthsToYears = (months: number) => {
    return (months / 12).toFixed(1) + 'y';
  };

  return (
    <section className="lg:col-span-2 bg-deep-space border border-resistance-red p-4">
      <div className="border-b border-resistance-red pb-2 mb-4">
        <h2 className="text-lg font-bold">
          {selectedCompany.name} // DEPARTURE STATS{" "}
          <span className="text-xs text-resistance-red">[LIVE]</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-void-black border border-matrix-green p-3">
          <h3 className="text-xs text-matrix-green mb-2">TOTAL DEPARTURES [30 DAYS]</h3>
          <div className="flex justify-between items-end">
            <div className="text-4xl font-bold">
              {selectedCompany.totalDepartures.toLocaleString()}
            </div>
            <div className="text-resistance-red text-sm">
              +23.5% <i className="fas fa-arrow-up"></i>
            </div>
          </div>
        </div>

        <div className="bg-void-black border border-matrix-green p-3">
          <h3 className="text-xs text-matrix-green mb-2">AVG. TENURE [DEPARTING]</h3>
          <div className="flex justify-between items-end">
            <div className="text-4xl font-bold">{monthsToYears(selectedCompany.avgTenure)}</div>
            <div className="text-data-yellow text-sm">
              -0.8y <i className="fas fa-arrow-down"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-void-black border border-resistance-red p-3 mb-4">
        <h3 className="text-xs text-resistance-red mb-2">DEPARTURE TRENDS [WEEKLY]</h3>
        <div className="h-48 flex items-end gap-1 pt-4">
          {selectedCompany.weeklyTrends.map((trend, index) => {
            const opacity = 0.2 + (index / selectedCompany.weeklyTrends.length) * 0.8;
            const isLastWeek = index === selectedCompany.weeklyTrends.length - 1;
            
            return (
              <div
                key={index}
                className={`flex-1 ${isLastWeek ? 'bg-resistance-red' : 'bg-matrix-green'}`}
                style={{ 
                  height: `${trend}%`,
                  opacity: isLastWeek ? 1 : opacity
                }}
              ></div>
            );
          })}
        </div>
        <div className="flex text-xs justify-between mt-2 text-gray-400">
          {selectedCompany.weeklyTrends.map((_, index) => (
            <span key={index}>
              {index === selectedCompany.weeklyTrends.length - 1 ? "NOW" : `W${index + 1}`}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-void-black border border-matrix-green p-3">
          <h3 className="text-xs text-matrix-green mb-2">COMMON EXIT REASONS</h3>
          <ul className="text-sm">
            {Object.entries(selectedCompany.exitReasons)
              .sort(([_, a], [__, b]) => b - a)
              .map(([reason, percentage], index, arr) => (
                <li key={reason} className={`flex justify-between py-1 ${
                  index < arr.length - 1 ? 'border-b border-deep-space' : ''
                }`}>
                  <span>{reason}</span>
                  <span className="text-resistance-red">{percentage}%</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-void-black border border-resistance-red p-3">
          <h3 className="text-xs text-resistance-red mb-2">DESTINATION // POST-EXIT</h3>
          <ul className="text-sm">
            {Object.entries(selectedCompany.destinations)
              .sort(([_, a], [__, b]) => b - a)
              .map(([destination, percentage], index, arr) => (
                <li key={destination} className={`flex justify-between py-1 ${
                  index < arr.length - 1 ? 'border-b border-deep-space' : ''
                }`}>
                  <span>{destination}</span>
                  <span className="text-matrix-green">{percentage}%</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
