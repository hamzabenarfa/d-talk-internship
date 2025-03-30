import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/actions/authActions";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth-header";
import { Mail, Lock, User, Phone, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/navbar";

const schema = yup.object().shape({
  nom: yup.string().required("Nom est requis"),
  prenom: yup.string().required("Prénom est requis"),
  email: yup
    .string()
    .email("Email n'est pas valide")
    .required("Email est requis"),
  telephone: yup
    .string()
    .matches(/^\d{8}$/, "Téléphone doit contenir 8 chiffres")
    .required("Téléphone est requis"),
  password: yup
    .string()
    .min(8, "Mot de passe doit contenir au moins 8 caractères")
    .required("Mot de passe est requis"),
  role: yup.string().required("Rôle est requis"),
  dateDeNaissance: yup
    .date()
    .required("Date de naissance est requise")
    .test("age", "Vous devez avoir au moins 18 ans", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      return age > 18 || (age === 18 && monthDiff >= 0);
    }),
});

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    role: "",
    dateDeNaissance: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isValid = await validateForm();
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/register",
        formData
      );
      if (response.data) {
        dispatch(loginSuccess(response.data));
        toast.success("Inscription réussie");
        switch (response.data.user.role) {
          case "ADMIN":
            router.push("/admin/dashboard");
            break;
          case "CANDIDAT":
          case "INTERN":
            router.push("/etudiant");
            break;
          case "PROF_SUPERVISOR":
            router.push("/encadrant");
            break;
          default:
            router.push("/");
            break;
        }
      }
    } catch (err) {
      toast.error(err.response?.data || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen  px-4 py-12">
        <div className="mx-auto max-w-md space-y-8">
          <AuthHeader
            title="Create Account"
            subtitle="Start your job search journey"
          />

          <div className="rounded-xl bg-white p-8 shadow-sm">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    className={`pl-10 ${errors.nom ? "border-red-500" : ""}`}
                    value={formData.nom}
                    onChange={handleChange}
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.nom && (
                  <div className="text-red-500 text-sm">{errors.nom}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    className={`pl-10 ${errors.prenom ? "border-red-500" : ""}`}
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.prenom && (
                  <div className="text-red-500 text-sm">{errors.prenom}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.email && (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="tel"
                    name="telephone"
                    placeholder="Téléphone"
                    className={`pl-10 ${
                      errors.telephone ? "border-red-500" : ""
                    }`}
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.telephone && (
                  <div className="text-red-500 text-sm">{errors.telephone}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={`pl-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="date"
                    name="dateDeNaissance"
                    className={`pl-10 ${
                      errors.dateDeNaissance ? "border-red-500" : ""
                    }`}
                    value={formData.dateDeNaissance}
                    onChange={handleChange}
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.dateDeNaissance && (
                  <div className="text-red-500 text-sm">
                    {errors.dateDeNaissance}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Select
                  name="role"
                  onValueChange={(value) =>
                    handleChange({ target: { name: "role", value } })
                  }
                >
                  <SelectTrigger
                    className={`w-full ${errors.role ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CANDIDAT">CANDIDAT</SelectItem>
                    <SelectItem value="PROF_SUPERVISOR">
                      PROF_SUPERVISOR
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <div className="text-red-500 text-sm">{errors.role}</div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-500 hover:text-pink-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
