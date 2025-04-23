import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../../axios-instance";
import { format, parseISO } from "date-fns";
import * as Yup from "yup";

interface UserType {
    id?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    role?: string;
    dateDeNaissance?: string;
}

interface UserFormModalProps {
    user?: UserType | null;
    onClose: () => void;
    onUpdate: () => void;
    token?: string;
    editMode?: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
    user,
    onClose,
    onUpdate,
    token,
    editMode,
}) => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        role: "CANDIDAT",
        password: "",
        dateDeNaissance: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validationSchema = Yup.object().shape({
        nom: Yup.string().required("Le nom est requis."),
        prenom: Yup.string().required("Le prénom est requis."),
        email: Yup.string()
            .email("L'email n'est pas valide.")
            .required("L'email est requis."),
        telephone: Yup.string()
            .matches(/^\d{8}$/, "Le téléphone doit contenir 8 chiffres.")
            .nullable(),
        password: editMode
            ? Yup.string().nullable()
            : Yup.string()
                  .required("Le mot de passe est requis.")
                  .min(6, "Le mot de passe doit avoir au moins 6 caractères."),
        dateDeNaissance: Yup.date()
            .required("La date de naissance est requise.")
            .test("age", "L'utilisateur doit avoir au moins 18 ans.", (value) => {
                if (!value) return false;
                const today = new Date();
                const birthDate = new Date(value);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (
                    monthDiff < 0 ||
                    (monthDiff === 0 && today.getDate() < birthDate.getDate())
                ) {
                    age--;
                }
                return age >= 18;
            }),
    });

    useEffect(() => {
        if (editMode && user) {
            const formattedDate = user.dateDeNaissance
                ? format(parseISO(user.dateDeNaissance), "yyyy-MM-dd")
                : "";

            setFormData({
                nom: user.nom || "",
                prenom: user.prenom || "",
                email: user.email || "",
                telephone: user.telephone || "",
                role: user.role || "CANDIDAT",
                password: "",
                dateDeNaissance: formattedDate,
            });
        }
    }, [user, editMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({}); // Clear old errors

            const dataToSend = {
                ...formData,
                telephone: Number(formData.telephone),
            };

            const url = editMode
                ? `http://localhost:4000/user/update/${user?.id}`
                : "http://localhost:4000/auth/register";
            const method = editMode ? "put" : "post";
            const headers = editMode ? { Authorization: `Bearer ${token}` } : {};

            await axiosInstance({ method, url, headers, data: dataToSend });

            toast.success(`Utilisateur ${editMode ? "modifié" : "ajouté"} avec succès!`);
            onUpdate();
            onClose();
        } catch (err: any) {
            if (err.name === "ValidationError") {
                const newErrors: Record<string, string> = {};
                err.inner.forEach((error: any) => {
                    newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
                toast.error("Veuillez corriger les erreurs dans le formulaire.");
            } else {
                toast.error(`Erreur: ${err?.response?.data?.message || err.message}`);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-lg font-bold mb-4">
                    {editMode ? "Modifier l'Utilisateur" : "Ajouter un Utilisateur"}
                </h2>
                <form onSubmit={handleSubmit} noValidate>
                    {[
                        { label: "Nom", name: "nom", type: "text" },
                        { label: "Prénom", name: "prenom", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Téléphone", name: "telephone", type: "number" },
                        { label: "Date de naissance", name: "dateDeNaissance", type: "date" },
                    ].map(({ label, name, type }) => (
                        <div key={name} className="mb-4">
                            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                                {label}
                            </label>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                value={formData[name as keyof typeof formData]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors[name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                            )}
                        </div>
                    ))}

                    {!editMode && (
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Rôle
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={user?.role === "RESPONSABLE"}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="CANDIDAT">Candidat</option>
                            <option value="PROF_SUPERVISOR">Encadreur</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
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
