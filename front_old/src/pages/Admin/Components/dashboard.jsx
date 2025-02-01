import { BarChart } from '../charts/candidat-mois';
import { BarChartCandidatSujet } from '../charts/candidat-sujet';
import { TacheRapport } from '../charts/tache-rapport-valide';
import { TacheRapportSujet } from '../charts/tache-rapport-sujet';
import { PfeCategoriesPieChart } from '../charts/pie-pfe-category';
import { CompletionSuccessPieChart } from '../charts/CompletionSuccessPieChart';
const AdminDashboard = () => {
    return (
        <div className="flex flex-row flex-wrap items-center justify-start">
        <div className="w-1/2 ">
                <BarChart />
                <BarChartCandidatSujet />
            </div>
       
            <div className="w-1/2">
                <TacheRapport />
                <TacheRapportSujet />
            </div>
            <div className="flex w-1/2">
                <PfeCategoriesPieChart />
                <CompletionSuccessPieChart />
            </div>
        </div>
    );
}

export default AdminDashboard;
