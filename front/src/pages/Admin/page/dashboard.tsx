// @ts-nocheck
import { BarChartCandidatSujet } from "../charts/candidat-sujet";
import { TacheRapport } from "../charts/tache-rapport-valide";
import { TacheRapportSujet } from "../charts/tache-rapport-sujet";
import { PfeCategoriesPieChart } from "../charts/pie-pfe-category";
import { CompletionSuccessPieChart } from "../charts/CompletionSuccessPieChart";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full bg-white rounded-lg shadow p-4">
          <TacheRapport />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <TacheRapportSujet />
        </div>

        <div className="w-full col-span-2 bg-white rounded-lg shadow p-4">
          <BarChartCandidatSujet />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <CompletionSuccessPieChart />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <PfeCategoriesPieChart />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="space-y-6">
      {/* Top row - Two charts side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <TacheRapport />
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <TacheRapportSujet />
        </div>
      </div>

      {/* Full width chart */}
      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
        <BarChartCandidatSujet />
      </div>

      {/* Bottom row - Two pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <CompletionSuccessPieChart />
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <PfeCategoriesPieChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;