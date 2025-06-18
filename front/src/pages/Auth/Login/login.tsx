// @ts-nocheck
import { Link, useLocation } from "react-router-dom";
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
import { Mail, Lock } from "lucide-react";
import Navbar from "@/components/navbar";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email n'est pas valide")
    .required("Email est requis"),
  password: yup.string().required("Mot de passe est requis"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Correctly renamed to `navigate`
  const location = useLocation(); // Access the current location

  const from = location.state?.from || "/";
  const validateForm = async () => {
    try {
      await schema.validate({ email, password }, { abortEarly: false });
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isValid = await validateForm();
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/login",
        {
          email,
          password,
        }
      );
      toast.success("Connexion réussie");
      console.log(response.data.user.role);
      if (response.data) {
        dispatch(loginSuccess(response.data));
        switch (response.data.user.role) {
          case "RESPONSABLE":
            navigate("/admin/dashboard");
            break;
          case "CANDIDAT":
            navigate(from === "/" ? "/etudiant/liste-candidature" : from, { replace: true });
            break;
          case "PROF_SUPERVISOR":
            navigate("/encadrant/profil");
            break;
          default:
            navigate(from, { replace: true });
            break;
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data.error || "Une erreur est survenue");
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
            title="Welcome Back"
            subtitle="Sign in to continue your job search"
          />

          <div className="rounded-xl bg-white p-8 shadow-sm">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Email address"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type="password"
                    placeholder="Password"
                    className={`pl-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                {/* <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-pink-500 hover:text-pink-600"
                  >
                    Forgot password?
                  </Link>
                </div> */}
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-pink-500 hover:text-pink-600">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
