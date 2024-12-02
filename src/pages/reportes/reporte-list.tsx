import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MainLayout } from "../../layouts/main-layout";
import { formatCurrency } from "../../utils/format";
import NewEmpleadoForm from "../empleados/components/new-empelado-form";
import { mockSalaryRecords } from "../../mocks/mock-salary-records";
import { SalaryRecord } from "../SalaryRecord";

function EmpleadoList() {
	const [recordToDelete, setRecordToDelete] = useState<SalaryRecord | null>(
		null
	); // Estado para eliminar
	const [recordToEdit, setRecordToEdit] = useState<SalaryRecord | null>(null); // Estado para editar
	const [search, setSearch] = useState(""); // Estado para búsqueda
	const [filteredRecords, setFilteredRecords] = useState(mockSalaryRecords); // Registros filtrados


	// Manejar cambios en la búsqueda
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toLowerCase();
		setSearch(value);

		if (value === "") {
			setFilteredRecords(mockSalaryRecords);
		} else {
			const filtered = mockSalaryRecords.filter((record) =>
				record.month.toLowerCase().includes(value)
			);
			setFilteredRecords(filtered);
		}
	};

	return (
		<MainLayout>
			<div className="p-10">
				<div className="flex justify-between items-center mb-2">
					<h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
					<Link
						to="/"
						className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
					>
						Volver
					</Link>
				</div>

				<div className="mb-3 flex justify-between">
					<input
						value={search}
						onChange={handleSearch} // Búsqueda dinámica
						placeholder="Buscar reporte por mes"
						type="text"
						className="rounded-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500 p-2 mr-4 min-w-52"
						required
					/>
					<div className="space-x-4">
						<NewEmpleadoForm /> {/* Botón "Crear Reportes" */}
					</div>
				</div>

				{filteredRecords.length > 0 ? (
					<div className="bg-white rounded-lg shadow overflow-hidden">
						<div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
							<table className="w-full">
								<thead className="bg-gray-50 sticky top-0">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Mes
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Total Salarios
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Total Deducciones
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Acciones
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredRecords.map((record) => (
										<tr key={record.month}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													{record.month}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{formatCurrency(record.totalSalary)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{formatCurrency(record.totalDeductions)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
												{/* Botón Editar */}
												<button
													onClick={() => setRecordToEdit(record)}
													className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
												>
													<Pencil className="w-4 h-4" />
													<span className="hidden md:inline">Editar</span>
												</button>
												{/* Botón Eliminar */}
												<button
													onClick={() => setRecordToDelete(record)}
													className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
												>
													<Trash2 className="w-4 h-4" />
													<span className="hidden md:inline">Eliminar</span>
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center space-y-4">
						<div className="text-gray-500 text-lg font-medium">
							No se encontraron reportes para el mes especificado.
						</div>
					</div>
				)}
			</div>
		</MainLayout>
	);
}

export default EmpleadoList;
