// planilla-list.tsx
import { Link } from "react-router-dom";
import { PayrollService } from "../services/payroll-service";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { formatCurrency } from "../../../utils/format";
import PrintPayrollModal from "../modal/planilla-modal";
import { MainLayout } from "../../../layouts/main-layout";
import { usePayrollStore } from "../../../store/payroll-store";
import { formatDisplayDate } from "../../../utils/datetimeUtil";

function PlanillaList() {
	const payrolls = usePayrollStore((state) => state.payrolls);
	const deletePayroll = usePayrollStore((state) => state.deletePayroll);

	const handleDelete = (id: string) => {
		if (window.confirm("¿Está seguro de eliminar esta planilla?")) {
			PayrollService.deletePayroll(id);
			deletePayroll(id);
			PayrollService.getPayrolls();
		}
	};

	return (
		<MainLayout>
			<div className="p-10">
				<div className="flex justify-between items-center mb-6">
					<h1 className="hidden sm:inline text-2xl font-bold text-gray-800">
						Generación de Planillas
					</h1>
					<h1 className="inline sm:hidden text-2xl font-bold text-gray-800">
						Planillas
					</h1>
					<div className="space-x-4">
						<Link
							to="/"
							className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
						>
							Volver
						</Link>
						<Link
							to="/planilla/add"
							className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
						>
							+ Crear Planilla
						</Link>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							{payrolls.length !== 0 ? (
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Empleado
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Fecha
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
											Salario Base
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
											Bonos
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
											Deducciones
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
											Salario Neto
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Acciones
										</th>
									</tr>
								</thead>
							) : (
								""
							)}
							<tbody className="bg-white divide-y divide-gray-200">
								{payrolls.length === 0 ? (
									<tr>
										<td colSpan={7} className="px-6 py-12 text-center">
											<div className="flex flex-col items-center justify-center space-y-4">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-16 w-16 text-gray-400"
													viewBox="0 0 24 24"
												>
													<path
														fill="currentColor"
														d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
													/>
													<path
														fill="currentColor"
														opacity="0.5"
														d="M8 14h8v2H8v-2zm0-3h8v2H8v-2z"
													/>
												</svg>
												<div className="text-gray-500 text-lg font-medium">
													No hay planillas registradas
												</div>
												<div className="text-gray-400">
													Comienza creando una nueva planilla usando el botón
													"Crear Planilla"
												</div>
											</div>
										</td>
									</tr>
								) : (
									payrolls.map((payroll) => {
										const totalBonos =
											(payroll.bonus || 0) + (payroll.vacation || 0);
										const baseSalary =
											payroll.firstQuinzena +
											payroll.secondQuinzena 
											// +
											// (payroll.overtimePay || 0);

										return (
											<tr key={payroll.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{payroll.employeeName}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-500 flex items-center gap-2">
														<Calendar className="w-4 h-4" />
														{formatDisplayDate(payroll.date)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
													<div className="text-sm text-gray-900">
														{formatCurrency(baseSalary)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
													<div className="text-sm text-gray-900">
														{formatCurrency(totalBonos)}
														{payroll.vacation > 0 && (
															<span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
																Vacaciones
															</span>
														)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
													<div className="text-sm text-gray-900">
														{formatCurrency(payroll.totalDeductions)}
														<div className="text-xs text-gray-500">
															ISSS: {formatCurrency(payroll.isss)} | AFP:{" "}
															{formatCurrency(payroll.afp)} | ISR:{" "}
															{formatCurrency(payroll.rent)}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
													<div className="text-sm font-medium text-gray-900">
														{formatCurrency(payroll.netSalary)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
													<Link
														to={`/planilla/${payroll.id}`}
														className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
													>
														<Pencil className="w-4 h-4" />
														<span className="hidden md:inline">Editar</span>
													</Link>
													<PrintPayrollModal payroll={payroll} />
													<button
														onClick={() => handleDelete(payroll.id)}
														className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
													>
														<Trash2 className="w-4 h-4" />
														<span className="hidden md:inline">Eliminar</span>
													</button>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}

export default PlanillaList;
