// @ts-nocheck
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../axios-instance";
import { toast } from "react-hot-toast";

const ValidationStage = () => {
    const [data, setData] = useState([]);
    console.log("🚀 ~ ValidationStage ~ data:", data)

    // Fetch the data
    const fetchData = async () => {
        try {
            const res = await axiosInstance.get('candidature/validation-stage');
            setData(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Use useEffect to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

  const handleValiderStage = async (id) => {
    try {
      const res = await axiosInstance.put(`candidature/valider/${id}`);
      toast.success("stage validé ");
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } 
  };

    
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                Liste des stages affectés
            </h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                            <th className="py-4 px-6 font-semibold text-left rounded-tl-lg">Nom de l'utilisateur</th>
                            <th className="py-4 px-6 font-semibold text-left">Titre du Sujet</th>
                            <th className="py-4 px-6 font-semibold text-left">Pourcentage Validé</th>
                            <th className="py-4 px-6 font-semibold text-left rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id} className={`hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="py-4 px-6 border-b text-gray-700">{item.user.nom}</td>
                                <td className="py-4 px-6 border-b text-gray-700">{item.sujet.titre}</td>
                              
                                <td className="py-4 px-6 border-b text-gray-700">
                                    {item.pourcentageValide.toFixed(2)}%
                                </td>
                                <td className="py-4 px-6 border-b text-gray-500">
  <button
    className={`font-bold py-2 px-4 rounded ${
      item.valide
        ? 'bg-green-400 cursor-not-allowed text-white'
        : 'bg-blue-500 hover:bg-blue-700 text-white'
    }`}
    onClick={() => !item.valide && handleValiderStage(item.id)}
    disabled={item.valide}
    title={item.valide ? "Ce stage est déjà validé" : ""}
  >
    {item.valide ? "Déjà Validé" : "Valider Stage"}
  </button>
</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ValidationStage;
