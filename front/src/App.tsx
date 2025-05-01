import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/home";
import Login from "./pages/Auth/Login/login";
import Register from "./pages/Auth/Register";
import Admin from "./pages/Admin/admin";
import Etudiant from "./pages/Etudiant/etudiant";
import AdminDashboard from "./pages/Admin/page/dashboard";
import EtudiantDashboard from "./pages/Etudiant/page/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GestionUsers from "./pages/Admin/page/gestion-users";
import GestionSujet from "./pages/Admin/page/gestion-sujet";
import Avancement from "./pages/Etudiant/Components/avancement";
import Encadrant from "./pages/Encadrant/encadrant";
import Sujet from "./pages/Sujet/sujet";
import Candidat from "./pages/Admin/Components/candidat";
import StagiairesAcceptes from "./pages/Admin/Components/stagaire";
import Stage from "./pages/Encadrant/page/stage";
import ListeCandidature from "./pages/Etudiant/Components/liste-candidature";
import Main from "./pages/Encadrant/page/main";
import ValidationStage from "./pages/Encadrant/page/ValidationStage";
import ProfileEnc from "./pages/Encadrant/page/ProfileEnc";
import Job from "./pages/search";
import Category from "./pages/Admin/page/category";
import AdminProfile from "./pages/Admin/page/profile";
import Profile from "./pages/Etudiant/Components/profile";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { path: "/", element: <Home /> },
        { path: "/search", element: <Job /> },

        { path: "login", element: <Login /> },
        { path: "signup", element: <Register /> },
        {
          path: "admin",
          element: <ProtectedRoute rolesRequired={["RESPONSABLE"]} />,
          children: [
            {
              path: "",
              element: <Admin />,
              children: [
                { path: "dashboard", element: <AdminDashboard /> },
                { path: "gestion-users", element: <GestionUsers /> },
                { path: "gestion-sujet", element: <GestionSujet /> },
                { path: "candidats", element: <Candidat /> },
                { path: "stagaire", element: <StagiairesAcceptes /> },
                { path: "category", element: <Category /> },
                { path: "profile", element: <AdminProfile /> },
              ],
            },
          ],
        },
        {
          path: "etudiant",
          element: <ProtectedRoute rolesRequired={["CANDIDAT", "INTERN"]} />,
          children: [
            {
              path: "",
              element: <Etudiant />,
              children: [
                { path: "avancement", element: <Avancement /> },
                { path: "Liste-Candidature", element: <ListeCandidature /> },
                { path: "profile", element: <Profile /> },
              ],
            },
          ],
        },
        {
          path: "encadrant",
          element: <ProtectedRoute rolesRequired={["PROF_SUPERVISOR"]} />,
          children: [
            {
              path: "",
              element: <Encadrant />,
              children: [
                { path: "", element: <Main /> },
                { path: "stage/:id", element: <Stage /> },
                { path: "validation-stage", element: <ValidationStage /> },
                { path: "profil", element: <ProfileEnc /> },
              ],
            },
          ],
        },
        { path: "sujet/:id", element: <Sujet /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
