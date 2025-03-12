// App.jsx o donde definas el enrutador
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InstalacionesPage from "./pages/InstalacionesPage";
import InstalacionDeletePage from "./pages/InstalacionDeletePage";
import InstalacionFormPage from "./pages/InstalacionFormPage";
import ReservasPage from "./pages/ReservasPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import HorariosList from "./components/HorariosList";
import HorarioDeletePage from "./pages/HorarioDeletePage";
import ReservasFormPage from "./pages/ReservaFormPage";
import ReservaDeletePage from "./pages/ReservaDeletePage";
import RegisterPage from "./pages/Register";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "instalaciones",
        element: <InstalacionesPage />,
      },
      {
        path: "instalacion/add",
        element: <InstalacionFormPage />,
      },
      {
        path: "instalacion/edit/:_id",
        element: <InstalacionFormPage />,
      },
      {
        path: "instalacion/del/:_id",
        element: <InstalacionDeletePage />,
      },
      {
        path: "horarios",
        element: <HorariosList />,
      },
      {
        path: "horarios/del/:_id",
        element: <HorarioDeletePage />,
      },
      {
        path: "mis-reservas",
        element: <ReservasPage />,
      },
      {
        path: "mis-reservas/add",
        element: <ReservasFormPage />,
      },
      {
        path: "mis-reservas/edit/:_id",
        element: <ReservasFormPage />,
      },
      {
        path: "mis-reservas/del/:_id",
        element: <ReservaDeletePage />,
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
