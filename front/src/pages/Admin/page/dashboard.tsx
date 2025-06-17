// @ts-nocheck
import { BarChartCandidatSujet } from "../charts/candidat-sujet";
import { TacheRapport } from "../charts/tache-rapport-valide";
import { TacheRapportSujet } from "../charts/tache-rapport-sujet";
import { PfeCategoriesPieChart } from "../charts/pie-pfe-category";
import { CompletionSuccessPieChart } from "../charts/CompletionSuccessPieChart";
const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
      <div className="w-full  bg-white rounded-lg shadow p-4">
      <TacheRapport />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <TacheRapportSujet />
      </div>

      <div className="w-full col-span-2 row-start-2  bg-white rounded-lg shadow p-4">
        <BarChartCandidatSujet />
      </div>

      <div className="w-full bg-white rounded-lg shadow p-4  gap-6">
        <CompletionSuccessPieChart />
      </div>
      <div className="bg-white rounded-lg  shadow p-4 ">
        <PfeCategoriesPieChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
