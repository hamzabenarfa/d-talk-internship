import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EtudiantDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    getSujet();
  }, []); 


  useEffect(() => {
    const filtered = results.filter((internship) =>
      internship.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchTerm, results]);

  async function getSujet() {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL+"/sujet");
      setResults(res.data);
      setFilteredResults(res.data); 
    } catch (error) {
      console.log(error);
    }
  }
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col gap-10 bg-grey-100 overflow-hidden sm:rounded-lg">
      <h1 className="text-4xl font-semibold capitalize">Liste des stages :</h1>
      <div className="">
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Rechercher des stages..."
            className="w-full p-4 text-lg rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4" id="learn-more">
          {filteredResults.map((internship) => (
            <div
              key={internship.id}
              className="flex justify-between items-end bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300 ease-in-out"
            >
              <div>
                <Link to={`/sujet/${internship.id}`}>
                  <h3 className="text-xl font-bold cursor-pointer">
                    {internship.titre}
                  </h3>
                </Link>
                <p className="text-gray-800">{internship.description}</p>
              </div>
              <Link to={`/sujet/${internship.id}`}>
                <button className="mt-8 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1">
                  Deposer
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EtudiantDashboard;