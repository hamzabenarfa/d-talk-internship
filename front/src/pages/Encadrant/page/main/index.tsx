import { useEffect, useState } from "react";
import axiosInstance from "../../../../../axios-instance";
import Toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/actions/authActions";

const Main = () => {
  const [userData, setUser] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // Fetch user profile
  async function getMyProfile() {
    const result = await axiosInstance.get("user/profile");
    setUser(result.data);
    setFormData({
      nom: result.data.nom,
      prenom: result.data.prenom,
      email: result.data.email,
      telephone: result.data.telephone,
    });
  }

  useEffect(() => {
    getMyProfile();
  }, []);

  // Modal handlers
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openPwdModal = () => setIsPwdModalOpen(true);
  const closePwdModal = () => setIsPwdModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Submit updated profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("user/update-profile", formData);
      getMyProfile();
      closeEditModal();
    } catch (error) {
      console.log("Failed to update user profile:", error);
      Toast.error(error.response.data.error);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("user/change-password", passwordData);
      closePwdModal();
    } catch (error) {
      Toast.error(error.response.data.error);
    }
  };

  const dispatch = useDispatch();
  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete("user/delete-account"); // Adjust this API route as needed
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {userData.nom} {userData.prenom}
          </h1>
          <p className="text-gray-600">Encadrant</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Téléphone:</span>{" "}
            {userData.telephone}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Date de naissance:</span>{" "}
            {new Date(userData.dateDeNaissance).toLocaleDateString()}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Inscrit le:</span>{" "}
            {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>
        {/* <div className="mt-6 space-y-3">
          <button
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={openEditModal}
          >
            Edit Profile
          </button>
          <button
            className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
            onClick={openPwdModal}
          >
            Change Password
          </button>
          
        </div> */}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {isPwdModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={closePwdModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    handleDeleteAccount && dispatch(logout());
                    navigate("/login");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
