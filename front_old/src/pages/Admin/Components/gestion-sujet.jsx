import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import SujetFormModal from "./sujet-form-modal";
import axiosInstance from "../../../../axios-instance";

export default function GestionSujet() {
  const token = useSelector((state) => state.auth.user.access_token);
  const [sujets, setSujets] = useState([]);
  const [currentSujet, setCurrentSujet] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSujets, setFilteredSujets] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const result = await axiosInstance.get("sujet");
      setSujets(result.data);
      setFilteredSujets(result.data); // Initialize filteredSujets with all data
    } catch (error) {
      console.error("Échec du chargement des sujets", error);
      toast.error("Échec du chargement des sujets");
    }
  };
  useEffect(() => {
    // Filter sujets whenever the search term changes
    const filtered = sujets.filter(
      (sujet) =>
        sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sujet.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSujets(filtered);
  }, [searchTerm, sujets]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce sujet ?")) {
      try {
        const res = await axiosInstance.delete(`sujet/delete/${id}`);
        if (res.status === 200) {
          setSujets((prevSujets) =>
            prevSujets.filter((sujet) => sujet.id !== id)
          );
          setFilteredSujets((prevSujets) =>
            prevSujets.filter((sujet) => sujet.id !== id)
          );
          toast.success("Sujet supprimé avec succès");
        } else {
          toast.error("Échec de la suppression du sujet");
        }
      } catch (err) {
        toast.error("Échec de la suppression du sujet");
        console.error(err);
      }
    }
  };

  const handleAddOrEdit = (sujet) => {
    setCurrentSujet(sujet);
    setEditMode(sujet !== null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentSujet(null);
    setModalOpen(false);
    setEditMode(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        Gestion des Sujets
      </h1>
      <button
        onClick={() => handleAddOrEdit(null)}
        className="mt-4 mb-6 py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-200"
      >
        Ajouter un Sujet
      </button>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Rechercher des sujets..."
          className="w-full p-4 text-lg rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* List of sujets */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Titre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Catégorie
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSujets.map((sujet) => (
              <tr key={sujet.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-balance">
                  {sujet.titre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-balance">
                  {sujet.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sujet.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleAddOrEdit(sujet)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(sujet.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <SujetFormModal
          sujet={currentSujet}
          closeModal={handleCloseModal}
          setSujets={setSujets}
          editMode={editMode}
          token={token}
        />
      )}
    </div>
  );
}
