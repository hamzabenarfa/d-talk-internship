import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Home/Components/header";
import { useSelector } from "react-redux";
import axiosInstance from "../../../axios-instance";
import Toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Building2, FileText } from "lucide-react";

const Sujet = () => {
  const role = useSelector((state) => state.auth.user?.user?.role);
  const { id } = useParams();
  const [sujet, setSujet] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSujetById();
  }, [id]);

  async function getSujetById() {
    try {
      const res = await axiosInstance.get(`sujet/${id}`);
      setSujet(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCvFileChange = (e) => {
    setCvFile(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    // Check if files are selected
    if (cvFile && cvFile.length > 0) {
      // Append each file to FormData
      for (let i = 0; i < cvFile.length; i++) {
        data.append("files", cvFile[i]);
      }
    } else {
      Toast.error("No files selected");
      return;
    }

    try {
      await axiosInstance.post("/candidature/" + id, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Toast.success("Files submitted successfully!");
      navigate("/etudiant");
    } catch (error) {
      console.error("Error submitting files:", error);
      Toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="w-full">
      {/* <Header /> */}
      <div className="relative flex flex-col items-center justify-center h-80 bg-gradient-to-r from-blue-400 to-purple-600">
        <h1 className="text-5xl text-white capitalize font-bold tracking-wider">
          {sujet.titre}
        </h1>
        <p className="text-xl font-medium text-gray-200">{sujet.description}</p>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Job Details Section */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{sujet.location || "Location not specified"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{sujet.duration || "Duration not specified"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span>{sujet.category || "Category not specified"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>{sujet.type || "Type not specified"}</span>
            </div>
          </div>
        </div>

        {/* Apply Section */}
        {role === "CANDIDAT" ? (
          <form
            className="flex flex-col items-center justify-center h-auto p-4 w-full"
            onSubmit={handleSubmit}
          >
            <div className="mb-6 w-full max-w-xl">
              <label
                htmlFor="cvFile"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Upload Documents
              </label>
              <input
                type="file"
                id="cvFile"
                name="cvFile"
                multiple
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleCvFileChange}
                required
              />
            </div>

            <button
              type="submit"
              className="text-white bg-black hover:bg-black/90 focus:ring-4 focus:outline-none focus:ring-black/50 font-medium rounded-full text-sm px-5 py-2.5 text-center"
            >
              Submit Application
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center pt-10">
            <h1 className="text-2xl font-semibold text-gray-700">
              Please log in as a CANDIDAT to apply for this internship.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sujet;