import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/home";
import Login from "./pages/Auth/Login/login";
import Register from "./pages/Auth/Register";
import Admin from "./pages/Admin/admin";
import Etudiant from "./pages/Etudiant/etudiant";
import AdminDashboard from "./pages/Admin/Components/dashboard";
import EtudiantDashboard from "./pages/Etudiant/Components/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GestionUsers from "./pages/Admin/Components/gestion-users";
import GestionSujet from "./pages/Admin/Components/gestion-sujet";
import Avancement from "./pages/Etudiant/Components/avancement";
import Encadrant from "./pages/Encadrant/encadrant";
import Sujet from "./pages/Sujet/sujet";
import Candidat from "./pages/Admin/Components/candidat";
import StagiairesAcceptes from "./pages/Admin/Components/stagaire";
import Stage from "./pages/Encadrant/page/stage";
import StagePage from "./pages/stage/stage";
import ListeStage from "./pages/Etudiant/Components/liste-stage";
import ListeCandidature from "./pages/Etudiant/Components/liste-candidature";
import Main from "./pages/Encadrant/page/main"
import ValidationStage from "./pages/Encadrant/page/ValidationStage";
import ProfileEnc from "./pages/Encadrant/page/ProfileEnc";
import Job from "./pages/job";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { path: "/", element: <Home /> },
        { path: "/job", element: <Job /> },

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
                { path: "stagaire", element: <StagiairesAcceptes /> }
              ],
            }
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
                { path: "liste-stage", element: <ListeStage /> },
                { path: "", element: <EtudiantDashboard /> },
                { path: "avancement", element: <Avancement /> },
                { path: "sujet", element: <Avancement /> },
                { path: "Liste-Candidature", element: <ListeCandidature/> }
              ],
            }
          ],
        },
        {
          path: "encadrant",
          element: <Encadrant />,
          children: [
            { path: "", element: <Main /> },
            { path: "stage/:id", element: <Stage /> },
            { path: "validation-stage", element: <ValidationStage /> },
            { path: "profil", element: <ProfileEnc /> },


          ],
        },
        { path: "sujet/:id", element: <Sujet /> },
        { path: "stage", element: <StagePage /> }
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
