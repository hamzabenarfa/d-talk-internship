// @ts-nocheck
import { useState, useEffect } from "react";
import axiosInstance from "../../../../axios-instance";
import Toast from "react-hot-toast";
import UserDetailsModal from "./UserDetailsModal";
import { Loader2 } from "lucide-react";

const Candidat = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState({});
  const [loadingRefuse, setLoadingRefuse] = useState({});

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
    setLoadingAccept((prev) => ({ ...prev, [id]: true }));
    try {
      await axiosInstance.put(`candidature/accepter/${id}`);
      Toast.success("Candidature acceptée.");
      fetchCandidates();
    } catch (error) {
      Toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoadingAccept((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRefuse = async (id) => {
    setLoadingRefuse((prev) => ({ ...prev, [id]: true }));
    try {
      await axiosInstance.put(`candidature/rejeter/${id}`);
      Toast.success("Candidature refusée.");
      fetchCandidates();
    } catch (error) {
      Toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoadingRefuse((prev) => ({ ...prev, [id]: false }));
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

      <div className="bg-white shadow  sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Etat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Détail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.user?.email || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.sujet?.titre || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.status || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleViewDetails(candidate)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Voir détail
                  </button>
                </td>
                <td className="flex items-center justify-center px-6 py-4 space-x-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleAccept(candidate.id)}
                    disabled={
                      candidate.status === "ACCEPTE" ||
                      loadingAccept[candidate.id]
                    }
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                      candidate.status === "ACCEPTE" || loadingAccept[candidate.id]
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {loadingAccept[candidate.id] ? <Loader2 className=" animate-spin " /> : "Accepter"}
                  </button>

                  <button
                    onClick={() => handleRefuse(candidate.id)}
                    disabled={
                      candidate.status === "REFUSE" ||
                      loadingRefuse[candidate.id]
                    }
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                      candidate.status === "REFUSE" || loadingRefuse[candidate.id]
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {loadingRefuse[candidate.id] ?  <Loader2 className=" animate-spin" /> : "Refuser"}
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
