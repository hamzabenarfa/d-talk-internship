import { useState, useEffect } from "react";
import axiosInstance from "../../../../axios-instance";
import Toast from "react-hot-toast";
import UserDetailsModal from "./UserDetailsModal";

const Candidat = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);
  const fetchCandidates = async () => {
    try {
      const response = await axiosInstance.get("/candidature");
      setCandidates(response.data);
    } catch (error) {
      Toast.error(
        "Erreur lors de la récupération des candidatures: " + error.message
      );
    }
  };
  const handleDownloadCV = async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/candidature/resources/download/${id}`,
        { responseType: "blob" }
      );
      const link = document.createElement("a");
      link.href = URL.createObjectURL(data);
      link.download = "resources.zip";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error(e);
      Toast.error(e.message);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axiosInstance.put(`candidature/accepter/${id}`);
      Toast.success(`Candidature ${id} acceptée.`);
      fetchCandidates();
    } catch (error) {
      Toast.error(error.response.data.error);
    }
  };

  const handleRefuse = async (id) => {
    try {
      await axiosInstance.put(`candidature/rejeter/${id}`);
      Toast.success(`Candidature ${id} refusée.`);
      fetchCandidates();
    } catch (error) {
      Toast.error(
        `Erreur lors du refus de la candidature ${id}: ${error.message}`
      );
    }
  };

  const handleViewDetails = (candidate) => {
    setSelectedUser(candidate);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-4">
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        Liste des Candidats au Stage
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
     
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Email
              </th>
        
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Stage
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Etat
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Détail
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates && candidates.map((candidate) => (
              <tr key={candidate.id}>
         
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.user?.email || ''}
                </td>
           
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.sujet?.titre || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {candidate.status || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleViewDetails(candidate)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Voir détail
                  </button>
                </td>
                <td className="px-6 py-4 space-x-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleAccept(candidate.id)}
                    disabled={candidate.status === "ACCEPTE"}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 
                                        ${
                                          candidate.status === "ACCEPTE"
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                        }`}
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => handleRefuse(candidate.id)}
                    disabled={candidate.status === "REFUSE"}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 
                                        ${
                                          candidate.status === "REFUSE"
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-red-500 text-white hover:bg-red-600"
                                        }`}
                  >
                    Refuser
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {detailsModalOpen && (
          <UserDetailsModal
            user={selectedUser}
            onClose={handleCloseDetailsModal}
            onDownloadCV={handleDownloadCV}
          />
        )}
      </div>
    </div>
  );
};

export default Candidat;
