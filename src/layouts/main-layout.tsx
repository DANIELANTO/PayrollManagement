import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../store/authStore";
import { Role } from "../types/roleEnum";

interface Props {
	children: React.ReactNode;
}

interface ItemLink {
	label: string;
	to: string;
	role: Role;
}

const links: ItemLink[] = [
	{ label: "Panel de Control", to: "/dashboard", role: Role.general },
	{ label: "Empleados", to: "/empleados", role: Role.admin },
	{ label: "Planillas", to: "/planillas", role: Role.user },
	{ label: "Reportes", to: "/reportes", role: Role.user },
];

export function MainLayout({ children }: Props): ReactNode {
	const logout = useAuth((state) => state.logout);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const role = useAuth((state) => state.getRole());

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="flex flex-col bg-gray-50 min-h-screen">
			<nav className="bg-cyan-500 px-10 md:px-10 py-4 shadow-lg sticky top-0">
				<div className="container">
					<div className="flex justify-between items-center">
						{/* Logo y nombre del negocio */}
						<div className="flex items-center">
							<Link
								to="/"
								className="hidden lg:inline text-white font-bold text-sm md:text-xl hover:text-white/90 truncate max-w-[200px] md:max-w-none"
							>
								Payroll App
							</Link>
							<Link
								to="/"
								className="inline lg:hidden text-white font-bold text-sm md:text-xl hover:text-white/90 truncate max-w-[200px] md:max-w-none"
							>
								Rodriguez y Asociados
							</Link>
						</div>

						{/* Botón del menú móvil */}
						<button
							className="md:hidden text-white p-2 hover:bg-cyan-600 rounded-lg"
							onClick={toggleMenu}
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>

						{/* Menú de navegación para desktop */}
						<ul className="hidden md:flex space-x-6">
							{links.map(
								(link) =>
									(role === link.role || role === Role.admin) && (
										<li key={link.to}>
											<Link
												to={link.to}
												className="text-white/90 hover:text-white hover:font-medium transition-colors"
											>
												{link.label}
											</Link>
										</li>
									)
							)}
							<li>
								<button
									className="text-white/90 hover:text-white hover:font-medium transition-colors flex items-center gap-2"
									onClick={logout}
								>
									<span className="hidden lg:block">Cerrar Sesión</span>
									<LogOut className="size-6" />
								</button>
							</li>
						</ul>
					</div>

					{/* Menú móvil */}
					{isMenuOpen && (
						<div className="md:hidden mt-4 pb-4">
							<ul className="flex flex-col space-y-4">
								{links.map(
									(link) =>
										(role === link.role || role === Role.admin) && (
											<li key={link.to}>
												<Link
													to={link.to}
													className="text-white/90 hover:text-white hover:font-medium transition-colors block py-2"
													onClick={() => setIsMenuOpen(false)}
												>
													{link.label}
												</Link>
											</li>
										)
								)}
								<li>
									<button
										className="text-white/90 hover:text-white hover:font-medium transition-colors flex gap-2 py-2"
										onClick={logout}
									>
										Cerrar Sesión
										<LogOut className="size-6" />
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</nav>
			{children}
		</div>
	);
}
