import { useEffect, useState } from "react";
import axiosInstance from "../../../../axios-instance";

const ListeCandidature = () => {
  const [data, setData] = useState([]); // State to hold fetched data

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/candidature/candidat`);
      setData(response.data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching candidatures:", error);
    }
  };

  // Fetch data only once when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="space-y-5">
      <h1 className="text-4xl font-semibold capitalize">Liste des candidatures :</h1>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr className="text-left">
            <th className="py-2 px-4 border-b">Sujet</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data &&
            data.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.sujet.titre}</td>
                <td className="py-2 px-4 border-b">{item.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListeCandidature;