import { useEffect, useState } from "react";
import axiosInstance from "../../../../axios-instance";

const ListeCandidature = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const fetchData = async () => {
    const response = await axiosInstance.get(`/candidature/candidat`);
    setData(response.data);
  };
  useEffect(() => {
    fetchData();
  });
  useEffect(() => {
    const filtered = results.filter(
      (internship) =>
        internship.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchTerm, results]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className=" space-y-5">
      <h1 className=" text-4xl font-semibold capitalize">
        Liste des candidatures :
      </h1>
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
