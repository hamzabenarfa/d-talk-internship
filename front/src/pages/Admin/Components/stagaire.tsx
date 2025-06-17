// @ts-nocheck
import { useState, useEffect } from "react";
import axiosInstance from "../../../../axios-instance";
import Toast from "react-hot-toast";
import UserDetailsModal from "./UserDetailsModal";

const StagiairesAcceptes = () => {
  const [interns, setInterns] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await axiosInstance.get("user/professeurs");
        setSupervisors(response.data);
      } catch (error) {
        console.error("Failed to fetch supervisors", error);
      }
    };

    fetchInterns();
    fetchSupervisors();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await axiosInstance.get("/candidature/allAvancements");
      setInterns(response.data);
    } catch (error) {
      console.error("Failed to fetch interns", error);
      Toast.error(
        "Erreur lors de la récupération des stagiaires: " + error.message
      );
    }
  };

  console.log(interns);

  const handleSupervisorChange = async (internId, supervisorId, sujetId) => {
    try {
      await axiosInstance.put(
        `candidature/encadrant/${supervisorId}/candidat/${internId}/sujet/${sujetId}`
      );
      fetchInterns();
      Toast.success("Superviseur assigné avec succès.");
    } catch (error) {
      console.error("Failed to assign supervisor", error);
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
        Stagiaires Acceptés
      </h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Nom
              </th>
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
                Téléphone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Sujet
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                CV
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Superviseur
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interns &&
              interns.map((intern) => (
                <tr key={intern.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {intern.user?.nom || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {intern.user?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {intern.user?.telephone || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {intern.sujet?.titre || "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleViewDetails(intern)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Voir détail
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={intern.supervisorId ? intern.supervisorId : ""}
                      onChange={(e) =>
                        handleSupervisorChange(
                          intern.user?.id,
                          e.target.value,
                          intern.sujetId
                        )
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Assigner un superviseur</option>
                      {supervisors.map((supervisor) => (
                        <option key={supervisor.id} value={supervisor.id}>
                          {supervisor.nom} {supervisor.prenom}
                        </option>
                      ))}
                    </select>
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

export default StagiairesAcceptes;
