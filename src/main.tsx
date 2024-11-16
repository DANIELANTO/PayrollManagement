import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/home-page";
import LoginPage from "./pages/login/login-page";
import EmpleadoList from "./pages/empleados/empleado-list";
import EmpleadoForm from "./pages/empleados/empleado-form";
import PlanillaList from "./pages/planillas/planilla-list";
import PlanillaForm from "./pages/planillas/planilla-form";
import ReporteList from "./pages/reportes/reporte-list";
import ReporteForm from "./pages/reportes/reporte-form";
import { Toaster } from "sonner";
import NotFoundPage from "./pages/notFoundPage/not-found-page";
import DashboardPage from "./pages/dashboard/dashboard-page";
import NotAuthorizedPage from "./pages/notAuthorized/not-authorized-page";
import ProtectedRoute from "./components/protected-route";
import { Role } from "./types/roleEnum";

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: (
				<ProtectedRoute>
					<HomePage />
				</ProtectedRoute>
			),
		},
		{
			path: "/login",
			element: <LoginPage />,
		},
		{
			path: "/empleados",
			element: (
				<ProtectedRoute role={Role.admin}>
					<EmpleadoList />
				</ProtectedRoute>
			),
		},
		{
			path: "/empleado/:id", // Para crear o editar empleados
			element: (
				<ProtectedRoute role={Role.admin}>
					<EmpleadoForm />
				</ProtectedRoute>
			),
		},
		{
			path: "/planillas",
			element: (
				<ProtectedRoute role={Role.user}>
					<PlanillaList />
				</ProtectedRoute>
			),
		},
		{
			path: "/planilla/:id", // Para crear o editar planillas
			element: (
				<ProtectedRoute role={Role.user}>
					<PlanillaForm />
				</ProtectedRoute>
			),
		},
		{
			path: "/reportes",
			element: (
				<ProtectedRoute role={Role.user}>
					<ReporteList />
				</ProtectedRoute>
			),
		},
		{
			path: "/reporte/:id", // Para crear o editar reportes
			element: (
				<ProtectedRoute role={Role.user}>
					<ReporteForm />
				</ProtectedRoute>
			),
		},
		{
			path: "*", // Ruta de error 404
			element: <NotFoundPage />,
		},
		{
			path: "/dashboard",
			element: (
				<ProtectedRoute role={Role.general}>
					<DashboardPage />
				</ProtectedRoute>
			),
		},
		{
			path: "/not-authorized",
			element: <NotAuthorizedPage />,
		},
	],
	{
		basename: "/ANF-Planilla",
	}
);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
		<Toaster richColors />
	</StrictMode>
);
