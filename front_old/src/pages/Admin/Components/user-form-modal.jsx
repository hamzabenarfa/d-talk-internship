import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../../axios-instance";

const UserFormModal = ({ user, onClose, onUpdate, token, editMode }) => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        role: "CANDIDAT", // Default role
        password: "",
        dateDeNaissance: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editMode && user) {
            setFormData({
                nom: user.nom || "",
                prenom: user.prenom || "",
                email: user.email || "",
                telephone: user.telephone || "",
                role: user.role || "CANDIDAT",
                dateDeNaissance: user.dateDeNaissance || "",
            });
        }
    }, [user, editMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const calculateAge = (date) => {
        const birthDate = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (calculateAge(formData.dateDeNaissance) < 18) {
            setErrors((prev) => ({
                ...prev,
                dateDeNaissance: "L'utilisateur doit avoir au moins 18 ans.",
            }));
            return;
        }
        try {
            const validatedData = {
                ...formData,
                telephone: Number(formData.telephone), // Ensure telephone is treated as a number
            };

            const url = editMode
                ? `http://localhost:4000/user/update/${user.id}`
                : "http://localhost:4000/auth/register";
            const method = editMode ? "put" : "post";
            const headers = editMode ? { Authorization: `Bearer ${token}` } : {};

            await axiosInstance({
                method,
                url,
                headers,
                data: validatedData,
            });
            toast.success(
                `Utilisateur ${editMode ? "modifié" : "ajouté"} avec succès!`
            );
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to submit user:", error);
            toast.error(
                `Erreur: ${
                    error.response ? error.response.data.message : error.message
                }`
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg">
                <h2 className="text-lg font-bold">
                    {editMode ? "Modifier l'Utilisateur" : "Ajouter un Utilisateur"}
                </h2>
                <form onSubmit={handleSubmit}>
                    {["nom", "prenom", "email", "telephone"].map((field) => (
                        <div key={field}>
                            <label
                                htmlFor={field}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type={
                                    field === "telephone"
                                        ? "number"
                                        : field === "email"
                                        ? "text"
                                        : "text"
                                }
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                            {errors[field] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                            )}
                        </div>
                    ))}

                    {!editMode && (
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Date De Naissance
                        </label>
                        <input
                            id="dateDeNaissance"
                            name="dateDeNaissance"
                            type="date"
                            required
                            className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            value={formData.dateDeNaissance}
                            onChange={handleChange}
                        />
                        {errors.dateDeNaissance && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.dateDeNaissance}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="CANDIDAT">Candidat</option>
                            <option value="PROF_SUPERVISOR">Professeur Superviseur</option>
                            <option value="INTERN">Stagiaire</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            {editMode ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
